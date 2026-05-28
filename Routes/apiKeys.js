const express = require('express');

const { checkAuth } = require('@middlewares/Auth');
const validateRequest = require('@middlewares/validate');
const { ApiKeyValidator } = require('@app/Validators');
const apiKeyController = require('@controllers/apiKey/api.controller');

const router = express.Router();

router.post('/', checkAuth, ApiKeyValidator.createApiKeyValidation, validateRequest, apiKeyController.createApiKey);

router.post('/validate', apiKeyController.validateApiKey);

router.get('/', checkAuth, apiKeyController.listApiKeys);
router.get('/:id', checkAuth, apiKeyController.getApiKeyById);
router.put('/:id', checkAuth, apiKeyController.updateApiKey);
router.delete('/:id', checkAuth, apiKeyController.deleteApiKey);

module.exports = router;


