const mongoose = require('mongoose');

const WebhookLogSchema = new mongoose.Schema({
  raw_payload: { type: Object },
  received_at: { type: Date, default: Date.now },
  processed: { type: Boolean, default: false },
  notes: String
});

module.exports = mongoose.model('WebhookLog', WebhookLogSchema);
