const express = require('express');
const validateRequest = require('@middlewares/validate');
const { EmailValidator, SmsValidator } = require('@app/Validators');
const comnController = require('@controllers/comn/comn.controller');

const { checkApiKey } = require('@middlewares/Key');

const router = express.Router();

router.post('/send-email', checkApiKey, EmailValidator.sendEmailValidator, validateRequest, comnController.sendEmail);
router.post('/send-sms', checkApiKey, SmsValidator.sendSmsValidator, validateRequest, comnController.sendSms);

router.get('/usage', checkApiKey, comnController.getUsageEvents);
router.get('/wallet', checkApiKey, comnController.getWallet);
router.get('/emails', checkApiKey, comnController.getEmails);
router.get('/sms', checkApiKey, comnController.getSms);

module.exports = router;
