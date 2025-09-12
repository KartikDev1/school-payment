// src/controllers/webhookController.js
const WebhookLog = require('../models/WebhookLog');
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const logger = require('../logger');

exports.handleWebhook = async (req, res) => {
  try {
    const payload = req.body || {};
    // Save raw payload for audit - include headers optionally
    const log = await WebhookLog.create({ raw_payload: payload, notes: `headers: ${JSON.stringify(req.headers)}` });

    const orderInfo = payload.order_info || {};
    const order_id = orderInfo.order_id;
    if (!order_id) {
      await WebhookLog.findByIdAndUpdate(log._id, { processed: false, notes: 'Missing order_info.order_id' });
      return res.status(400).json({ message: 'order_info.order_id missing' });
    }

    // Try find by ObjectId first
    let order = null;
    try {
      if (/^[0-9a-fA-F]{24}$/.test(order_id)) {
        order = await Order.findById(order_id);
      }
    } catch (e) {
      // ignore parse errors
    }

    // Fallback: find by custom_order_id
    if (!order) {
      order = await Order.findOne({ custom_order_id: order_id });
    }

    if (!order) {
      await WebhookLog.findByIdAndUpdate(log._id, { processed: false, notes: 'Order not found for provided id' });
      logger.error('Webhook order not found for id', order_id);
      return res.status(404).json({ message: 'Order not found' });
    }

    const updated = {
      order_amount: orderInfo.order_amount,
      transaction_amount: orderInfo.transaction_amount,
      payment_mode: orderInfo.payment_mode,
      payment_details: orderInfo.payemnt_details || orderInfo.payment_details || '',
      bank_reference: orderInfo.bank_reference || '',
      payment_message: orderInfo.Payment_message || orderInfo.payment_message || '',
      status: orderInfo.status || '',
      error_message: orderInfo.error_message || '',
      payment_time: orderInfo.payment_time ? new Date(orderInfo.payment_time) : undefined,
      gateway: orderInfo.gateway || ''
    };

    await OrderStatus.findOneAndUpdate(
      { collect_id: order._id },
      { $set: updated },
      { upsert: true, new: true }
    );

    await WebhookLog.findByIdAndUpdate(log._id, { processed: true, notes: 'Processed successfully' });

    return res.json({ success: true });
  } catch (err) {
    logger.error('Webhook handler error', err);
    return res.status(500).json({ message: 'Webhook processing error', error: err.message });
  }
};
