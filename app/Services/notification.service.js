const logger = require('@config/logger');
const queuePublisher = require('@queues/publisher');
const db = require('@db/models');
const { emitWalletUpdate } = require('@app/sockets');

const publishQueueMessage = async (queue, payload) => {
    try {
        await queuePublisher.publish(queue, payload);
    } catch (error) {
        logger.error(`Failed to publish queue message: ${queue}`, error);
        throw error;
    }
};

const processNotification = async ({
    apiKeyRecord,
    cost,
    type,
    logModel,
    createPayload,
    queuePayload,
    queue,
}) => {
    //
    const wallet = apiKeyRecord.wallet;
    if (!wallet) {
        throw new Error('Wallet not found');
    }
    const now = new Date();

    const isFreeActive =
        wallet.is_free &&
        (!wallet.free_expires_at || new Date(wallet.free_expires_at) > now);

    // Calculate quantity based on recipient count (to_email or to_number array)
    const recipients = createPayload.to_email || createPayload.to_number || [];
    const quantity = Array.isArray(recipients) ? recipients.length : 1;
    const totalCost = cost * quantity;

    if (!isFreeActive && Number(wallet.balance) < totalCost) {
        throw new Error('Insufficient wallet balance');
    }
    //
    const result = await db.sequelize.transaction(async (transaction) => {
        const log = await logModel.create(
            {
                api_key_id: apiKeyRecord.id,
                ...createPayload,
                status: 'queued',
                retry_count: 0,
            },
            { transaction }
        );
        await db.UsageEvent.create(
            {
                api_key_id: apiKeyRecord.id,
                service_type: type,
                unit_cost: cost,
                quantity: quantity,
                total_cost: totalCost,
                reference_id: String(log.id),
                mode: isFreeActive ? 'free' : 'paid',
            },
            { transaction }
        );
        //
        if (!isFreeActive) {
            const newBalance = Number(wallet.balance) - totalCost;
            await wallet.update(
                { balance: newBalance.toFixed(2) },
                { transaction }
            );
            //
            const payload = {
                balance: newBalance.toFixed(2),
                alert: false,
            };

            if (
                wallet.low_balance_alert &&
                newBalance <= Number(wallet.low_balance_alert)
            ) {
                payload.alert = true;
                payload.alertThreshold = wallet.low_balance_alert;
                payload.message = `Wallet balance is below ${wallet.low_balance_alert}`;
            }
            emitWalletUpdate(apiKeyRecord.user_id, payload);
            //
            await db.Transaction.create(
                {
                    user_id: apiKeyRecord.user_id,
                    wallet_id: wallet.id,
                    type: 'debit',
                    amount: totalCost,
                    status: 'success',
                    reference_id: `${type}_${log.id}`,
                },
                { transaction }
            );
        }
        //
        return log;
    });

    if (!isFreeActive) {
        await publishQueueMessage(queue, {
            id: result.id,
            api_key_id: apiKeyRecord.id,
            ...queuePayload,
        });
    }

    return result;
};

module.exports = {
    publishQueueMessage,
    processNotification,
};