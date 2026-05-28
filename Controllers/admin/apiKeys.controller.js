const db = require('@db/models');
const { NotFoundError } = require('@errors');

const listApiKeys = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const { rows, count } = await db.ApiKey.findAndCountAll({ limit: Number(limit), offset: Number(offset), order: [['created_at', 'DESC']] });
  return res.status(200).json({ success: true, data: rows, pagination: { total: count, page: Number(page), limit: Number(limit) } });
};

const getApiKey = async (req, res) => {
  const apiKey = await db.ApiKey.findByPk(req.params.id);
  if (!apiKey) throw new NotFoundError('API Key not found');
  return res.status(200).json({ success: true, data: apiKey });
};

const updateApiKey = async (req, res) => {
  const apiKey = await db.ApiKey.findByPk(req.params.id);
  if (!apiKey) throw new NotFoundError('API Key not found');
  ['project_name', 'status'].forEach((f) => {
    if (req.body[f] !== undefined) apiKey[f] = req.body[f];
  });
  await apiKey.save();
  return res.status(200).json({ success: true, data: apiKey });
};

const deleteApiKey = async (req, res) => {
  const apiKey = await db.ApiKey.findByPk(req.params.id);
  if (!apiKey) throw new NotFoundError('API Key not found');
  await apiKey.destroy();
  return res.status(200).json({ success: true });
};

module.exports = { listApiKeys, getApiKey, updateApiKey, deleteApiKey };
