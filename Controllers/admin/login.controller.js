const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('@db/models');
const { AuthorizeError } = require('@errors');

const adminLogin = async (req, res) => {
    //
    const { email, password } = req.body;
    //
    const admin = await db.User.findOne({
        where: { email, role: 'admin' },
    });
    if (!admin) {
        throw new AuthorizeError('Admin not found');
    }
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
        throw new AuthorizeError('Invalid credentials');
    }
    //
    const token = jwt.sign(
        {
            id: admin.id,
            role: admin.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    //
    return res.json({
        success: true,
        data: {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                role: admin.role,
            },
        },
    });
};

module.exports = { adminLogin };