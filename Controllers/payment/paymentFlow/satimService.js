const satim = require('@config/satim');
const { handleSatimError } = require('./satim.error');

const registerSatimOrder = (payload) => satim.registerOrder(payload).catch(handleSatimError);
const fetchSatimOrderStatus = (orderId) => satim.getOrderStatus({ orderId }).catch(handleSatimError);

module.exports = {
  registerSatimOrder,
  fetchSatimOrderStatus,
};
