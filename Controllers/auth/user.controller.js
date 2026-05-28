const bcrypt = require("bcrypt");
const db = require("@db/models");
const { AuthorizeError, NotFoundError } = require("@errors");

const { UserResource } = require("@app/resource");
const S3HandleJsonImage = require("@app/s3/HandleJson");



const getUserByToken = async (req, res) => {
    //
    const user = await db.User.findByPk(req.user.id);
    if (!user) throw new NotFoundError('User not found');
    //
    res.status(200).json({
        success: true,
        user: UserResource(user)
    });
};

const getUserById = async (req, res) => {
    //
    const user = await db.User.findByPk(req.params.id);
    if (!user) throw new NotFoundError('User not found');
    //
    res.status(200).json({
        success: true,
        user: UserResource(user)
    });
};

const updateUserByToken = async (req, res) => {
    //
    const user = await db.User.findByPk(req.user.id);
    if (!user) throw new NotFoundError('User not found');
    // 
    if (req.body.image) {
        await S3HandleJsonImage(user, req.body.image);
    }
    //
    const allowedUpdates = ['name', 'email', 'phone'];
    allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) user[field] = req.body[field];
    });
    await user.save();
    //
    res.status(200).json({
        success: true,
        message: 'User updated',
        user: UserResource(user)
    });
};


const resetPassword = async (req, res) => {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    const user = await db.User.findByPk(userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new AuthorizeError("Old password is incorrect");
    }
    //
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    //
    return res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
};


module.exports = {
    getUserByToken,
    getUserById,
    updateUserByToken,
    resetPassword,
};