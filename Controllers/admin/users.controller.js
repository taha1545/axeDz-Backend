const db = require('@db/models');
const { NotFoundError } = require('@errors');

const listUsers = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
  const offset = (page - 1) * limit;

  const { rows, count } = await db.User.findAndCountAll({ limit, offset, order: [['created_at', 'DESC']] });

  return res.status(200).json({
    success: true,
    data: rows,
    pagination: { total: count, page, limit },
  });
};

const getUser = async (req, res) => {
  const user = await db.User.findByPk(req.params.id, { include: ['wallet'] });
  if (!user) throw new NotFoundError('User not found');
  return res.status(200).json({ success: true, data: user });
};

const updateUser = async (req, res) => {
  const user = await db.User.findByPk(req.params.id);
  if (!user) throw new NotFoundError('User not found');

  ['name', 'email', 'phone', 'is_verified'].forEach((f) => {
    if (req.body[f] !== undefined) user[f] = req.body[f];
  });
  await user.save();

  return res.status(200).json({ success: true, data: user });
};

module.exports = { listUsers, getUser, updateUser };
