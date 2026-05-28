const express = require('express');
const contactController = require('@controllers/auth/contact.controller');
const { checkAuth } = require('@middlewares/Auth');
const { checkAdmin } = require('@middlewares/Admin');

const router = express.Router();

router.post('/', contactController.Create);


router.get('/', checkAuth, checkAdmin, contactController.All);
router.put('/:id', checkAuth, checkAdmin, contactController.Update);
router.delete('/:id', checkAuth, checkAdmin, contactController.Delete);

module.exports = router;