const db = require('@db/models');
const { NotFoundError } = require('@errors');

const listContacts = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  if (status) where.status = status;
  const { rows, count } = await db.Contact.findAndCountAll({ where, limit: Number(limit), offset: Number(offset), order: [['created_at', 'DESC']] });
  return res.status(200).json({ success: true, data: rows, pagination: { total: count, page: Number(page), limit: Number(limit) } });
};

const updateContact = async (req, res) => {
  const contact = await db.Contact.findByPk(req.params.id);
  if (!contact) throw new NotFoundError('Contact not found');
  if (req.body.status !== undefined) contact.status = req.body.status;
  await contact.save();
  return res.status(200).json({ success: true, data: contact });
};

const deleteContact = async (req, res) => {
  const contact = await db.Contact.findByPk(req.params.id);
  if (!contact) throw new NotFoundError('Contact not found');
  await contact.destroy();
  return res.status(200).json({ success: true });
};

module.exports = { listContacts, updateContact, deleteContact };
