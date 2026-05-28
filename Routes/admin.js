const express = require('express');
const { checkAuth } = require('@middlewares/Auth');
const { checkAdmin } = require('@middlewares/Admin');

const adminController = require('@controllers/admin/admin.controller');
const adminUsers = require('@controllers/admin/users.controller');
const adminApiKeys = require('@controllers/admin/apiKeys.controller');
const adminContacts = require('@controllers/admin/contacts.controller');
const adminPayments = require('@controllers/admin/payments.controller');
const adminWallets = require('@controllers/admin/wallets.controller');

const router = express.Router();

router.use(checkAuth);
router.use(checkAdmin);

router.get('/dashboard', adminController.dashboard);
router.get('/stats/users', adminController.userStats);

// Users
router.get('/users', adminUsers.listUsers);
router.get('/users/:id', adminUsers.getUser);
router.put('/users/:id', adminUsers.updateUser);

// Wallets
router.get('/wallets', adminWallets.listWallets);
router.get('/wallets/:id', adminWallets.getWallet);

// API Keys
router.get('/api-keys', adminApiKeys.listApiKeys);
router.get('/api-keys/:id', adminApiKeys.getApiKey);
router.put('/api-keys/:id', adminApiKeys.updateApiKey);
router.delete('/api-keys/:id', adminApiKeys.deleteApiKey);

// Contacts
router.get('/contacts', adminContacts.listContacts);
router.put('/contacts/:id', adminContacts.updateContact);
router.delete('/contacts/:id', adminContacts.deleteContact);

// Payments & transactions
router.get('/payments', adminPayments.listPayments);
router.get('/transactions', adminPayments.listTransactions);
router.put('/payments/:id/status', adminPayments.updatePaymentStatus);

module.exports = router;