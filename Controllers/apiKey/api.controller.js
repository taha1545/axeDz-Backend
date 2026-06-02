
const ApiKeyResource = require('@app/resource/apiKeyResource');
const { NotFoundError } = require('@errors');
const db = require('@db/models');
const { Op } = require('sequelize');
const crypto = require('crypto');

const createApiKey = async (req, res) => {
    //
    userId = req.user.id;
    const user = await db.User.findByPk(userId);
    if (!user || !user.is_verified) {
        throw new NotFoundError('User not verified or not found');
    }
    //
    const key = crypto.randomUUID();
    const status = 'active';
    //
    const apiKey = await db.ApiKey.create({
        user_id: user.id,
        project_name: req.body.project_name,
        status,
        key,
    });
    //
    res.status(201).json({
        success: true,
        apiKey: ApiKeyResource(apiKey),
    });
};

const listApiKeys = async (req, res) => {
    //
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    //
    const where = {
        user_id: req.user.id,
    };
    if (req.query.status) {
        where.status = req.query.status;
    }
    if (req.query.project_name) {
        where.project_name = {
            [Op.like]: `%${req.query.project_name}%`,
        };
    }
    if (req.query.key) {
        where.key = req.query.key;
    }
    //
    const offset = (page - 1) * limit;
    const { count, rows } = await db.ApiKey.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']],
    });
    //
    res.status(200).json({
        success: true,
        apiKeys: rows.map(ApiKeyResource),
        pagination: {
            total: count,
            page,
            pages: Math.ceil(count / limit),
        },
    });
};

const getApiKeyById = async (req, res) => {
    const apiKey = await db.ApiKey.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id,
        },
    });
    //
    if (!apiKey) throw new NotFoundError('API key not found');
    //
    res.status(200).json({
        success: true,
        apiKey: ApiKeyResource(apiKey),
    });
};

const updateApiKey = async (req, res) => {
    const apiKey = await db.ApiKey.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id,
        },
    });
    //
    if (!apiKey) throw new NotFoundError('API key not found');
    //
    ['project_name', 'status'].forEach((field) => {
        if (req.body[field] !== undefined) {
            apiKey[field] = req.body[field];
        }
    });
    await apiKey.save();
    //
    res.status(200).json({
        success: true,
        message: 'API key updated',
        apiKey: ApiKeyResource(apiKey),
    });
};

const deleteApiKey = async (req, res) => {
    const apiKey = await db.ApiKey.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id,
        },
    });
    if (!apiKey) throw new NotFoundError('API key not found');
    await apiKey.destroy();
    res.status(200).json({
        success: true,
        message: 'API key deleted successfully',
    });
};

const validateApiKey = async (req, res) => {
    const apiKey = await db.ApiKey.findOne({
        where: {
            key: req.body.key,
            status: 'active',
        },
    });
    if (!apiKey) throw new NotFoundError('API key not found or inactive');
    //
    res.status(200).json({
        success: true,
        message: 'API key is valid',
        apiKey: ApiKeyResource(apiKey),
    });
};

const rotateApiKey = async (req, res) => {
    //
    const apiKey = await db.ApiKey.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id,
        },
    });
    if (!apiKey) {
        throw new NotFoundError('API key not found');
    }
    //
    const newKey = crypto.randomUUID();
    //
    apiKey.key = newKey;
    await apiKey.save();
    //
    return res.status(200).json({
        success: true,
        message: 'API key rotated successfully',
        apiKey: ApiKeyResource(apiKey),
    });
};

const getApiKeyStats = async (req, res) => {
    //
    const apiKey = await db.ApiKey.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id,
        },
    });
    if (!apiKey) throw new NotFoundError('API key not found');
    //
    const [smsCount, emailCount, usage] = await Promise.all([
        db.SmsLog.count({ where: { api_key_id: apiKey.id } }),
        db.EmailLog.count({ where: { api_key_id: apiKey.id } }),
        db.UsageEvent.findAll({
            where: { api_key_id: apiKey.id },
        }),
    ]);
    const totalCost = usage.reduce((sum, u) => sum + Number(u.total_cost), 0);
    //
    return res.json({
        success: true,
        data: {
            smsCount,
            emailCount,
            totalCost,
            wallet: req.apiKey?.wallet?.balance,
        },
    });
};

module.exports = {
    createApiKey,
    listApiKeys,
    getApiKeyById,
    updateApiKey,
    deleteApiKey,
    validateApiKey,
    rotateApiKey,
    getApiKeyStats,
};