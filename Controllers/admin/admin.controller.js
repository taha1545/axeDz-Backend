const db = require('@db/models');
const { Op, Sequelize } = require('sequelize');

// ======================= DASHBOARD =======================
const dashboard = async (req, res) => {
    //
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    //
    const [
        totalApiKeys,

        totalPayments,
        successfulPayments,
        totalRevenue,
        monthlyRevenue,

        totalTransactions,

        totalSms,
        monthlySms,

        totalEmails,
        monthlyEmails,

        walletsSum,
        recentUsers,
        recentPayments,
    ] = await Promise.all([

        db.ApiKey.count(),

        // PAYMENTS
        db.Payment.count(),
        db.Payment.count({ where: { status: 'success' } }),

        db.Payment.sum('amount', {
            where: { status: 'success' },
        }),

        db.Payment.sum('amount', {
            where: {
                status: 'success',
                created_at: { [Op.gte]: startOfMonth },
            },
        }),

        // TRANSACTIONS
        db.Transaction.count(),

        // SMS
        db.SmsLog ? db.SmsLog.count() : 0,
        db.SmsLog
            ? db.SmsLog.count({
                where: { created_at: { [Op.gte]: startOfMonth } },
            })
            : 0,

        // EMAIL
        db.EmailLog ? db.EmailLog.count() : 0,
        db.EmailLog
            ? db.EmailLog.count({
                where: { created_at: { [Op.gte]: startOfMonth } },
            })
            : 0,

        // WALLET
        db.Wallet.sum('balance'),

        // RECENT
        db.User.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            attributes: ['id', 'name', 'email', 'is_verified', 'created_at'],
        }),

        db.Payment.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            attributes: ['id', 'amount', 'status', 'currency', 'created_at'],
        }),
    ]);

    return res.status(200).json({
        success: true,
        data: {
            api_keys: {
                total: totalApiKeys,
            },

            payments: {
                total: totalPayments,
                successful: successfulPayments,
                total_revenue: Number(totalRevenue || 0),
                monthly_revenue: Number(monthlyRevenue || 0),
            },

            transactions: {
                total: totalTransactions,
            },

            usage: {
                sms: {
                    total: totalSms,
                    this_month: monthlySms,
                },
                email: {
                    total: totalEmails,
                    this_month: monthlyEmails,
                },
            },

            wallets: {
                total_balance: Number(walletsSum || 0),
            },

            recent: {
                users: recentUsers,
                payments: recentPayments,
            },
        },
    });
};

// ======================= USER STATS  =======================
const userStats = async (req, res) => {
    //
    const now = new Date();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    //
    const [
        totalUsers,
        verifiedUsers,
        newUsersToday,
        usersWithBalance,
    ] = await Promise.all([
        db.User.count(),
        db.User.count({ where: { is_verified: true } }),
        db.User.count({ where: { created_at: { [Op.gte]: last24h } } }),
        db.Wallet.count({ where: { balance: { [Op.gt]: 0 } } }),
    ]);
    //
    return res.status(200).json({
        success: true,
        data: {
            total_users: totalUsers,
            verified_users: verifiedUsers,
            new_users_today: newUsersToday,
            users_with_balance: usersWithBalance,
        },
    });
};

module.exports = {
    dashboard,
    userStats,
};