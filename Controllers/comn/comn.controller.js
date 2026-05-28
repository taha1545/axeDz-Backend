const db = require('@db/models');
const rabbitConfig = require('@config/rabbitmq');

const NotificationService = require('@app/Services/notification.service');

const EMAIL_COST = Number(process.env.EMAIL_COST || 1);
const SMS_COST = Number(process.env.SMS_COST || 3);


const sendEmail = async (req, res, next) => {
  //
  const { to_email, subject, message, body_type = 'text' } = req.body;
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
      body: message,
      body_type,
    },
    queuePayload: {
      to_email,
      subject,
      message,
      body_type,
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
  const { to_number, message, provider = null } = req.body;
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
    },
    queuePayload: {
      to_number,
      message,
      provider,
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


module.exports = {
  sendEmail,
  sendSms,
  getUsageEvents,
  getEmails,
  getSms,
};