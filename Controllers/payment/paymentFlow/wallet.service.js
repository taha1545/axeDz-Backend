const { Transaction, Wallet } = require('@db/models');
const {
  NotFoundError,
  ValidationError,
} = require('@errors');
const helpers = require('@app/Services/payment.helpers');

//
const getValidatedWallet = async (userId, walletId, options = {}) => {
  const wallet = await Wallet.findOne({
    where: { user_id: userId },
    ...options,
  });
  if (!wallet) throw new NotFoundError('Wallet not found', { userId });
  //
  return wallet;
};

//
const updateWalletBalance = async (wallet, amount, type, transaction) => {
  //
  const currentBalance = helpers.toMoneyNumber(wallet.balance);
  const normalizedAmount = helpers.toMoneyNumber(amount);
  //
  if (type === 'debit' && currentBalance < normalizedAmount) {
    throw new ValidationError('Insufficient wallet balance', {
      currentBalance,
      requestedAmount: normalizedAmount,
    });
  }
  //
  wallet.balance = helpers.toMoneyNumber(
    type === 'credit' ? currentBalance + normalizedAmount : currentBalance - normalizedAmount
  );
  wallet.updated_at = new Date();
  return wallet.save({ transaction });
};

//
const recordLedgerTransaction = async (data, transaction) => {
  return Transaction.create(
    {
      user_id: data.userId,
      wallet_id: data.walletId,
      type: data.type,
      amount: helpers.toMoneyNumber(data.amount),
      status: 'success',
      reference_id: data.referenceId,
      metadata: data.metadata || {},
    },
    { transaction }
  );
};

module.exports = {
  getValidatedWallet,
  updateWalletBalance,
  recordLedgerTransaction,
};
