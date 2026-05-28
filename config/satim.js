const { Satim } = require('satim-node-sdk');
require('dotenv').config();

const satim = new Satim({
    username: process.env.SATIM_USERNAME,
    password: process.env.SATIM_PASSWORD,
    terminalId: process.env.SATIM_TERMINAL_ID,
    sandbox: process.env.SATIM_SANDBOX === 'true',
});

module.exports = satim;