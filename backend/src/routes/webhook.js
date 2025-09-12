const express = require('express');
const webhookController = require('../controllers/webhookController');
const verifyWebhook = require('../middleware/verifyWebHook');
const router = express.Router();

// Public webhook endpoint but optionally verified if WEBHOOK_SECRET is set
router.post('/', verifyWebhook, webhookController.handleWebhook);

module.exports = router;
