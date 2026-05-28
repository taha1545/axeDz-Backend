const db = require('@db/models');
const { AuthorizeError } = require('@errors');

const checkApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            return next(new AuthorizeError('API key required'));
        }
        // 
        const key = await db.ApiKey.findOne({
            where: { key: apiKey },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    include: [
                        {
                            model: db.Wallet,
                            as: 'wallet',
                        },
                    ],
                },
            ],
        });
        if (!key) {
            return next(new AuthorizeError('API key not found'));
        }
        if (key.status !== 'active') {
            return next(new AuthorizeError(`API key is ${key.status}`));
        }
        if (!key.user.wallet) {
            return next(new AuthorizeError('Wallet not found'));
        }
        req.apiKey = key;
        req.apiKey.wallet = key.user.wallet;

        next();
    } catch (err) {
        next(new AuthorizeError(`API key validation failed: ${err.message}`));
    }
};

module.exports = { checkApiKey };