const db = require('@db/models');
const rabbitConfig = require('@config/rabbitmq');

const NotificationService = require('@app/Services/notification.service');

const EMAIL_COST = Number(process.env.EMAIL_COST);
const SMS_COST = Number(process.env.SMS_COST);


const sendEmail = async (req, res, next) => {
  //
  const { to_email, subject, body, body_type = 'text', callback_url = "", callback_data = {}, senderName } = req.body;
  //
  const apiKeyRecord = req.apiKey;
  if (!apiKeyRecord) {
    throw new Error('API key context missing');
  }
  //
  const result = await NotificationService.processNotification({
    apiKeyRecord,
    cost: EMAIL_COST,
    type: 'email',
    logModel: db.EmailLog,
    createPayload: {
      to_email,
      subject,
      body,
      body_type,
      callback_url,
      callback_data,
    },
    queuePayload: {
      to_email,
      subject,
      body,
      body_type,
      callback_url,
      callbackData :callback_data,
      senderName
    },
    queue: rabbitConfig.queues.email,
  });
  //
  return res.status(202).json({
    success: true,
    data: {
      id: result.id,
      status: result.status,
    },
  });
};

const sendSms = async (req, res, next) => {
  //
  const { to_number, message, provider = null, callback_url = "", callback_data = {} } = req.body;
  const senderName = "axedz";
  //
  const apiKeyRecord = req.apiKey;
  if (!apiKeyRecord) {
    throw new Error('API key context missing');
  }
  //
  const result = await NotificationService.processNotification({
    apiKeyRecord,
    cost: SMS_COST,
    type: 'sms',
    logModel: db.SmsLog,
    createPayload: {
      to_number,
      message,
      provider,
      callback_url,
      callback_data,
    },
    queuePayload: {
      to_number,
      message,
      provider,
      senderName,
      callback_url,
      clientCorrelator : callback_data,
    },
    queue: rabbitConfig.queues.sms,
  });
  //
  return res.status(202).json({
    success: true,
    data: {
      id: result.id,
      status: result.status,
    },
  });
};

const getUsageEvents = async (req, res, next) => {
  //
  const limit = Number(req.query.limit) || 20;
  const offset = Number(req.query.offset) || 0;
  //
  const { rows, count } = await db.UsageEvent.findAndCountAll({
    where: { api_key_id: req.apiKey.id },
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });
  //
  return res.status(200).json({
    success: true,
    data: {
      records: rows,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count,
      },
    },
  });
};

const getEmails = async (req, res, next) => {
  //
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;
  //
  const { rows, count } = await db.EmailLog.findAndCountAll({
    where: { api_key_id: req.apiKey.id },
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });
  //
  return res.status(200).json({
    success: true,
    data: {
      records: rows,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count,
      },
    },
  });
};

const getSms = async (req, res, next) => {
  //
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;
  //
  const { rows, count } = await db.SmsLog.findAndCountAll({
    where: { api_key_id: req.apiKey.id },
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return res.status(200).json({
    success: true,
    data: {
      records: rows,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count,
      },
    },
  });
};

const getWallet = async (req, res, next) => {
  const wallet = req.apiKey?.wallet;

  if (!wallet) {
    throw new Error('Wallet not found for this API key');
  }

  return res.status(200).json({
    success: true,
    data: {
      id: wallet.id,
      user_id: wallet.user_id,
      balance: wallet.balance,
      currency: wallet.currency,
      is_free: wallet.is_free,
      free_expires_at: wallet.free_expires_at,
    },
    message: 'Wallet balance fetched successfully',
  });
};

module.exports = {
  sendEmail,
  sendSms,
  getUsageEvents,
  getEmails,
  getSms,
  getWallet,
};