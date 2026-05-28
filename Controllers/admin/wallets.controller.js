const db = require('@db/models');
const { NotFoundError } = require('@errors');

const listWallets = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const { rows, count } = await db.Wallet.findAndCountAll({ limit: Number(limit), offset: Number(offset), order: [['created_at', 'DESC']], include: ['user'] });
  return res.status(200).json({ success: true, data: rows, pagination: { total: count, page: Number(page), limit: Number(limit) } });
};

const getWallet = async (req, res) => {
  const wallet = await db.Wallet.findByPk(req.params.id, { include: ['user'] });
  if (!wallet) throw new NotFoundError('Wallet not found');
  return res.status(200).json({ success: true, data: wallet });
};

module.exports = { listWallets, getWallet };
