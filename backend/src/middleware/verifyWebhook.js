// src/middleware/verifyWebhook.js
const crypto = require('crypto');
const logger = require('../logger');

/**
 * Verify webhook signature if WEBHOOK_SECRET is set in env.
 * Expected header: 'x-webhook-signature' (HMAC SHA256 of raw body)
 * If WEBHOOK_SECRET not set, middleware allows requests.
 */
module.exports = (req, res, next) => {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return next(); // no verification required

  // Ensure rawBody was captured (set in index.js)
  const raw = req.rawBody || JSON.stringify(req.body || {});
  const signatureHeader = req.headers['x-webhook-signature'] || req.headers['x-signature'] || req.headers['x-hub-signature'];

  if (!signatureHeader) {
    logger.error('Webhook signature missing');
    return res.status(401).json({ message: 'Webhook signature missing' });
  }

  const computed = crypto.createHmac('sha256', secret).update(raw).digest('hex');

  // Accept header formats like 'sha256=...' or raw hex
  const incoming = signatureHeader.includes('=') ? signatureHeader.split('=')[1] : signatureHeader;

  if (!crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(incoming))) {
    logger.error('Webhook signature mismatch', { computed, incoming });
    return res.status(401).json({ message: 'Invalid webhook signature' });
  }

  return next();
};
