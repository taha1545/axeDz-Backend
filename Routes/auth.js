const express = require('express');
const { checkAuth } = require('@middlewares/Auth');
const validateRequest = require('@middlewares/validate');
const { UserValidator } = require('@app/Validators');
const { upload } = require('@app/s3/upload');
const authController = require('@controllers/auth/auth.controller');
const verifyController = require('@controllers/auth/verify.controller');
const otpPassController = require('@controllers/auth/otpPass.controller');
const storageController = require('@controllers/auth/storage.controller');
const userController = require('@controllers/auth/user.controller');
const adminLogin = require('@controllers/admin/login.controller');

const router = express.Router();



router.post('/signup', upload.single('image'), UserValidator.signupValidation, validateRequest, authController.signUp);
router.post('/login', UserValidator.loginValidation, validateRequest, authController.login);
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/logout', checkAuth, authController.logout);

router.post('/admin/login', adminLogin.adminLogin);

router.post('/send-reset-otp', otpPassController.sendResetOtp);
router.put('/reset-password-otp', otpPassController.resetPasswordWithOtp);
router.patch('/reset-password', checkAuth, userController.resetPassword);

router.post('/send-verify-sms-otp', verifyController.sendVerifySmsOtp);
router.put('/verify-sms', verifyController.verifySmsOtp);

router.get('/me', checkAuth, userController.getUserByToken);
router.put('/update', checkAuth, UserValidator.updateUserValidation, validateRequest, userController.updateUserByToken);

router.get('/storage', storageController.getSignedUrl);
router.delete('/storage', storageController.deleteStorageFile);{}

module.exports = router;
