const { Payment, Transaction, sequelize } = require('@db/models');
const logger = require('@config/logger');
const satim = require('@config/satim');
const { ValidationError } = require('@errors');
//
const { DZDToCentimes } = require('satim-node-sdk');
const { findPayment, updatePaymentStatus } = require('./payment.service');
const helpers = require('@app/Services/payment.helpers');
const { emitWalletUpdate } = require('@app/sockets');
const {
  getValidatedWallet,
  updateWalletBalance,
  recordLedgerTransaction,
} = require('./wallet.service');
const {
  fetchSatimOrderStatus,
  registerSatimOrder,
} = require('./satimService');


// ============================
// INITIATE PAYMENT FLOW
// ============================
const initiatePaymentFlow = async ({
  userId,
  amount,
  currency = 'DZD',
  description,
}) => {
  //
  const normalizedUserId = helpers.toUserId(userId);
  if (!normalizedUserId) {
    throw new ValidationError('Invalid user_id', { userId });
  }
  //
  const orderRef = helpers.createReference('order');
  const normalizedAmount = helpers.toMoneyNumber(amount);
  //
  const payment = await Payment.create({
    user_id: normalizedUserId,
    amount: normalizedAmount,
    currency,
    status: 'pending',
    order_id: orderRef,
  });
  // const satimOrder = await registerSatimOrder({
  //   orderNumber: orderRef,
  //   amount: DZDToCentimes(normalizedAmount),
  //   returnUrl: env.satim.returnUrl,
  //   failUrl: env.satim.failUrl,
  //   description: description || `Wallet top-up for user ${userId}`,
  //   additionalParams: {
  //     paymentId: payment.id,
  //     userId: String(normalizedUserId),
  //     walletId,
  //     orderNumber: orderRef,
  //   },
  // });
  // await payment.update({
  //   order_id: satimOrder.orderId,
  //   raw_response: satimOrder,
  // });

  logger.info('SATIM payment initiated', {
    paymentId: payment.id,
    orderId: payment.order_id,
  });
  //
  return {
    payment,
    satim: {
      // order_id: satimOrder.orderId,
      // form_url: satimOrder.formUrl,
    },
  };
};

// ============================
// SYNC PAYMENT STATUS FLOW
// ============================
const syncPaymentStatusFlow = async ({ orderId, userId }) => {
  //
  const payment = await findPayment(orderId, userId);
  //
  const satimStatus = { "status": "success", "disc": "just test for payment" };//await fetchSatimOrderStatus(payment.order_id);
  const isSuccessful = true;//satim.isPaymentSuccessful(satimStatus);

  const updatedPayment = await sequelize.transaction(async (t) => {
    const lockedPayment = await payment.reload({
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (lockedPayment.status === 'success') {
      return lockedPayment.update(
        { raw_response: satimStatus },
        { transaction: t }
      );
    }

    await updatePaymentStatus(lockedPayment, isSuccessful, satimStatus, t);

    if (isSuccessful) {
      const wallet = await getValidatedWallet(
        lockedPayment.user_id,
        null,
        {
          transaction: t,
          lock: t.LOCK.UPDATE,
        }
      );

      await updateWalletBalance(
        wallet,
        lockedPayment.amount,
        'credit',
        t
      );

      await recordLedgerTransaction(
        {
          userId: lockedPayment.user_id,
          walletId: wallet.id,
          type: 'credit',
          amount: lockedPayment.amount,
          referenceId: lockedPayment.order_id,
          metadata: {
            payment_id: lockedPayment.id,
            satim_order_id: lockedPayment.order_id,
            // action_code: satimStatus.actionCode,
            // order_status: satimStatus.orderStatus,
          },
        },
        t
      );

      emitWalletUpdate(lockedPayment.user_id, {
        walletId: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
        type: 'credit',
        amount: lockedPayment.amount,
      });
    }

    return lockedPayment;
  });

  logger.info('SATIM payment synchronized', {
    paymentId: updatedPayment.id,
    status: updatedPayment.status,
  });

  return {
    payment: updatedPayment,
    satim: satimStatus,
  };
};

//
// ============================
// PAYMENT HISTORY FLOW
// ============================
const getPaymentHistoryFlow = async (userIdParam) => {
  //
  const user_id = helpers.toUserId(userIdParam);

  const query = {
    where: { user_id },
    order: [['created_at', 'DESC']],
    limit: 20,
  };

  const [payments, transactions] = await Promise.all([
    Payment.findAll(query),
    Transaction.findAll(query),
  ]);

  return {
    payments,
    transactions,
  };
};

module.exports = {
  initiatePaymentFlow,
  syncPaymentStatusFlow,
  getPaymentHistoryFlow,
};