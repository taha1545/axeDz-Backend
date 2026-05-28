//
const crypto = require('crypto');

const toMoneyNumber = (value) =>
    Number(Number(value || 0).toFixed(2));

const toCentimes = (amount) =>
    Math.round(toMoneyNumber(amount) * 100);

const createReference = (prefix) =>
    `${prefix}_${crypto.randomUUID()}`;

const toUserId = (value) => {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed)
        ? null
        : parsed;
};

module.exports = {
    toMoneyNumber,
    toCentimes,
    createReference,
    toUserId
};