const db = require('@db/models');
const { NotFoundError } = require('@errors');

const listPayments = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const { rows, count } = await db.Payment.findAndCountAll({ limit: Number(limit), offset: Number(offset), order: [['created_at', 'DESC']] });
  return res.status(200).json({ success: true, data: rows, pagination: { total: count, page: Number(page), limit: Number(limit) } });
};

const listTransactions = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const { rows, count } = await db.Transaction.findAndCountAll({ limit: Number(limit), offset: Number(offset), order: [['created_at', 'DESC']] });
  return res.status(200).json({ success: true, data: rows, pagination: { total: count, page: Number(page), limit: Number(limit) } });
};

const updatePaymentStatus = async (req, res) => {
  const payment = await db.Payment.findByPk(req.params.id);
  if (!payment) throw new NotFoundError('Payment not found');
  const { status } = req.body;
  if (status) {
    payment.status = status;
    await payment.save();
  }
  return res.status(200).json({ success: true, data: payment });
};

module.exports = { listPayments, listTransactions, updatePaymentStatus };
