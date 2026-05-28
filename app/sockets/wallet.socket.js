const registerWalletEvents = (io) => {
    io.on('connection', (socket) => {

        socket.on('subscribeWallet', ({ userId }) => {
            if (!userId) return;
            const room = `wallet_${userId}`;
            socket.join(room);
        });

        socket.on('unsubscribeWallet', ({ userId }) => {
            if (!userId) return;
            const room = `wallet_${userId}`;
            socket.leave(room);
        });
    });
};

const emitWalletUpdate = (io, userId, payload) => {
    if (!io || !userId) return;
    const room = `wallet_${userId}`;
    io.to(room).emit('wallet:update', payload);
};

module.exports = {
    registerWalletEvents,
    emitWalletUpdate,
};
