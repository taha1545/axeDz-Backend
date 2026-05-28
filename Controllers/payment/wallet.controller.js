const db = require('@db/models');
const { NotFoundError, ValidationError } = require('@errors');


const switchToProduction = async (req, res, next) => {
  //
  const userId = req.user.id;
  if (!userId) {
    throw new ValidationError('Invalid userId', { userId });
  }
  //
  const wallet = await db.Wallet.findOne({
    where: { user_id: userId },
  });
  if (!wallet) {
    throw new NotFoundError('Wallet not found', { userId });
  }
  await wallet.update({
    is_free: false,
    free_expires_at: null,
  });
  //
  return res.status(200).json({
    success: true,
    message: 'Switched to production mode successfully',
    data: {
      id: wallet.id,
      is_free: wallet.is_free,
    },
  });
};

const getWalletBalance = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ValidationError('Invalid userId', { userId: req.user.id });
  }
  const wallet = await db.Wallet.findOne({ where: { user_id: userId } });
  if (!wallet) {
    throw new NotFoundError('Wallet not found', { userId });
  }
  //
  const data = {
    id: wallet.id,
    user_id: wallet.user_id,
    balance: wallet.balance,
    currency: wallet.currency,
    is_free: wallet.is_free,
    free_expires_at: wallet.free_expires_at,
  };
  //
  return res.status(200).json({
    success: true,
    data,
    message: 'Wallet balance fetched successfully',
  });
};

module.exports = {
  getWalletBalance,
  switchToProduction,
};
