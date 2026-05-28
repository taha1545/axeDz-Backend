const {
  initiatePaymentFlow,
  syncPaymentStatusFlow,
  getPaymentHistoryFlow,
} = require('./paymentFlow/main');

const helpers = require('../../app/Services/payment.helpers');

//
const initiatePayment = async (req, res) => {
  const userId = req.user?.id;
  //
  const {
    amount,
    currency,
    description,
  } = req.body;

  const data = await initiatePaymentFlow({
    userId,
    amount,
    currency,
    description,
  });

  return res.status(201).json({
    success: true,
    message: 'Payment initiated successfully',
    data,
  });
};

//
const syncPaymentStatus = async (req, res) => {
  const { orderId } = req.params;

  const userId = req.user?.id
    ? helpers.toUserId(req.user.id)
    : null;

  const data = await syncPaymentStatusFlow({
    orderId,
    userId,
  });

  return res.status(200).json({
    success: true,
    message: 'Payment status synchronized successfully',
    data,
  });
};

//
const getPaymentHistory = async (req, res) => {
  const data = await getPaymentHistoryFlow(req.user.id);

  return res.status(200).json({
    success: true,
    message: 'Payment history fetched successfully',
    data,
  });
};

module.exports = {
  initiatePayment,
  syncPaymentStatus,
  getPaymentHistory,
};