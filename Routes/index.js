const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const contactsRoutes = require('./contacts');
const apiKeysRoutes = require('./apiKeys');
const paymentRoutes = require('./payment');
const comnRoutes = require('./comn');
const adminRoutes = require('./admin');
const googleRoutes = require('./google');
const githubRoutes = require('./github');

router.use('/google', googleRoutes);
router.use('/github', githubRoutes);
router.use('/auth', authRoutes);
router.use('/contacts', contactsRoutes);
router.use('/api-keys', apiKeysRoutes);
router.use('/payments', paymentRoutes);
router.use('/communication', comnRoutes);
router.use('/admin', adminRoutes);

module.exports = router;