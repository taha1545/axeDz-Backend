const db = require('@db/models');
const { AuthorizeError } = require('@errors');

const checkAdmin = async (req, res, next) => {
    //
    const userId = req.user?.id;
    if (!userId) {
        return next(new AuthorizeError('Authentication required'));
    }
    const user = await db.User.findByPk(userId);
    if (!user) {
        return next(new AuthorizeError('Authenticated user not found'));
    }
    //
    if (user.role !== 'admin') {
        return next(new AuthorizeError('Admin access required'));
    }
    //
    req.user.role = user.role;
    //
    return next();
};

module.exports = {
    checkAdmin,
};
