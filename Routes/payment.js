const express = require('express');

const validateRequest = require('@middlewares/validate');
const { PaymentValidator } = require('@app/Validators');
const { checkAuth } = require('@middlewares/Auth');

const paymentController = require('@controllers/payment/payment.controller');
const transactionController = require('@controllers/payment/transaction.controller');
const walletController = require('@controllers/payment/wallet.controller');

const router = express.Router();

router.post(
    '/initiate',
    checkAuth,
    PaymentValidator.initiatePaymentValidator,
    validateRequest,
    paymentController.initiatePayment
);

router.post(
    '/status/:orderId/sync',
    checkAuth,
    paymentController.syncPaymentStatus
);

router.get(
    '/history',
    checkAuth,
    paymentController.getPaymentHistory
);


router.get(
    '/transactions',
    checkAuth,
    transactionController.getTransactionHistory
);

router.get(
    '/wallet',
    checkAuth,
    walletController.getWalletBalance
);

router.post(
    '/wallet/switch-to-production',
    checkAuth,
    walletController.switchToProduction
);

module.exports = router;