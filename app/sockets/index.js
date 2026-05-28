
const { Server } = require('socket.io');
const config = require('@config');
//
const {
    registerWalletEvents,
    emitWalletUpdate: emitWalletUpdateInternal
} = require('./wallet.socket');

let io;

const initSockets = (server) => {
    //
    if (io) return io;
    //
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    registerWalletEvents(io);
    return io;
};

const emitWalletUpdate = (userId, payload) => emitWalletUpdateInternal(io, userId, payload);

module.exports = {
    initSockets,
    emitWalletUpdate,
};
