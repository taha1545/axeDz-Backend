const { Payment } = require('@db/models');
const { NotFoundError, ValidationError } = require('@errors');

const findPayment = async (orderId, userId) => {
    const payment = await Payment.findOne({
        where: {
            order_id: orderId,
            ...(userId && { user_id: userId }),
        },
    });
    if (!payment) {
        throw new NotFoundError('Payment not found', { orderId });
    }
    if (!payment.order_id) {
        throw new ValidationError('Payment lacks SATIM transaction ID', {
            paymentId: payment.id,
        });
    }
    return payment;
};

const updatePaymentStatus = async (payment, isSuccessful, satimStatus, t) => {
    return payment.update(
        {
            status: isSuccessful ? 'success' : 'failed',
            raw_response: satimStatus,
        },
        { transaction: t }
    );
};

module.exports = {
    findPayment,
    updatePaymentStatus,
}