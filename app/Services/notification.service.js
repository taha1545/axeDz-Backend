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

    if (!isFreeActive && Number(wallet.balance) < cost) {
        throw new Error('Insufficient wallet balance');
    }
    //
    const result = await db.sequelize.transaction(async (transaction) => {
        const log = await logModel.create(
            {
                api_key_id: apiKeyRecord.id,
                ...createPayload,
                status: isFreeActive ? 'simulated' : 'queued',
                retry_count: 0,
            },
            { transaction }
        );
        await db.UsageEvent.create(
            {
                api_key_id: apiKeyRecord.id,
                service_type: type,
                unit_cost: cost,
                quantity: 1,
                total_cost: cost,
                reference_id: String(log.id),
                mode: isFreeActive ? 'free' : 'paid',
            },
            { transaction }
        );
        //
        if (!isFreeActive) {
            const newBalance = Number(wallet.balance) - cost;
            await wallet.update(
                { balance: newBalance.toFixed(2) },
                { transaction }
            );
            emitWalletUpdate(apiKeyRecord.user_id, newBalance.toFixed(2));
            await db.Transaction.create(
                {
                    user_id: apiKeyRecord.user_id,
                    wallet_id: wallet.id,
                    type: 'debit',
                    amount: cost,
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