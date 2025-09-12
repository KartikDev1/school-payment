// src/controllers/paymentController.js
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const config = require('../config');
const logger = require('../logger');

/**
 * Create collect request on gateway per provided doc:
 * POST { school_id, amount, callback_url, sign }
 * sign = jwt.sign({ school_id, amount, callback_url }, PG_KEY)
 *
 * Response contains: collect_request_id, Collect_request_url (payment URL), sign
 */
exports.createPayment = async (req, res) => {
  try {
    const { school_id, amount, custom_order_id, student_info, gateway_name } = req.body;
    if (!school_id || !amount || !custom_order_id) {
      return res.status(400).json({ message: 'school_id, amount and custom_order_id are required' });
    }

    // create local order
    const order = await Order.create({
      school_id,
      student_info,
      custom_order_id,
      gateway_name: gateway_name || 'edviron'
    });

    // create initial status doc
    const statusDoc = await OrderStatus.create({
      collect_id: order._id,
      order_amount: Number(amount),
      status: 'initiated',
      gateway: gateway_name || 'edviron'
    });

    // build callback URL (gateway will redirect/post to this after payment)
    const callbackUrl = `${req.protocol}://${req.get('host')}/api/webhook`;

    // sign payload with PG_KEY (doc required)
    const signPayload = {
      school_id: school_id,
      amount: String(amount),
      callback_url: callbackUrl
    };

    let sign;
    try {
      sign = jwt.sign(signPayload, config.PG_KEY, { algorithm: 'HS256', expiresIn: '10m' });
    } catch (e) {
      logger.error('Failed to sign payload with PG_KEY', e);
      return res.status(500).json({ message: 'Failed to sign payload' });
    }

    // prepare request body
    const body = {
      school_id: school_id,
      amount: String(amount),
      callback_url: callbackUrl,
      sign
    };

    // call gateway create-collect-request
    const gatewayUrl = `${config.PAYMENT_API_BASE.replace(/\/$/, '')}/create-collect-request`;
    let gatewayResp = null;
    try {
      const resp = await axios.post(gatewayUrl, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.PAYMENT_API_KEY}`
        },
        timeout: 10000
      });
      gatewayResp = resp.data || {};
    } catch (err) {
      // Log and continue with fallback
      logger.error('create-collect-request call failed:', err.message || err);
      gatewayResp = null;
    }

    // if gateway returned a collect_request_id and URL, persist collect_request_id in status and return redirect url
    let redirect_url = null;
    let collect_request_id = null;
    if (gatewayResp) {
      // try multiple possible key names
      collect_request_id = gatewayResp.collect_request_id || (gatewayResp.data && gatewayResp.data.collect_request_id) || null;
      redirect_url = gatewayResp.Collect_request_url || gatewayResp.collect_request_url || (gatewayResp.data && (gatewayResp.data.Collect_request_url || gatewayResp.data.collect_request_url)) || null;
      // update sign returned optionally (not necessary)
    }

    // Persist collect_request_id if available
    if (collect_request_id) {
      await OrderStatus.findOneAndUpdate(
        { collect_id: order._id },
        { $set: { collect_request_id, order_amount: Number(amount), status: 'initiated', payment_time: null } },
        { new: true }
      );
    }

    // Fallback: if no redirect_url from gateway, build mock redirect
    if (!redirect_url) {
      redirect_url = `${config.PAYMENT_API_BASE.replace(/\/$/, '')}/mock-pay?collect_id=${order._id.toString()}`;
    }

    return res.json({
      success: true,
      order_id: order._id,
      custom_order_id: order.custom_order_id,
      collect_request_id: collect_request_id || null,
      redirect_url
    });
  } catch (err) {
    logger.error('createPayment error', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};


/**
 * Check payment status on gateway:
 * GET /erp/collect-request/{collect_request_id}?school_id={school_id}&sign={sign}
 * sign = jwt.sign({ school_id, collect_request_id }, PG_KEY)
 *
 * This controller calls the gateway status API and updates OrderStatus accordingly.
 */
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { collect_request_id } = req.params;
    const { school_id } = req.query;

    if (!collect_request_id || !school_id) {
      return res.status(400).json({ message: 'collect_request_id (path) and school_id (query) are required' });
    }

    // Sign payload with PG_KEY
    const signPayload = {
      school_id,
      collect_request_id
    };

    let sign;
    try {
      sign = jwt.sign(signPayload, config.PG_KEY, { algorithm: 'HS256', expiresIn: '10m' });
    } catch (e) {
      logger.error('Failed to sign status payload', e);
      return res.status(500).json({ message: 'Failed to sign payload' });
    }

    // Construct URL
    const gatewayUrl = `${config.PAYMENT_API_BASE.replace(/\/$/, '')}/collect-request/${encodeURIComponent(collect_request_id)}?school_id=${encodeURIComponent(school_id)}&sign=${encodeURIComponent(sign)}`;

    let gatewayResp;
    try {
      const resp = await axios.get(gatewayUrl, {
        headers: {
          Authorization: `Bearer ${config.PAYMENT_API_KEY}`
        },
        timeout: 10000
      });
      gatewayResp = resp.data || {};
    } catch (err) {
      logger.error('collect-request status call failed:', err.message || err);
      return res.status(502).json({ message: 'Failed to call payment gateway' });
    }

    // Gateway response example:
    // { "status":"SUCCESS","amount":100, "details": {...}, "jwt": "<token>" }
    const gwStatus = (gatewayResp.status || '').toString().toLowerCase();
    const amount = gatewayResp.amount || null;

    // Try find order status by collect_request_id first
    let statusDoc = await OrderStatus.findOne({ collect_request_id });
    // Fallback: maybe collect_request_id not persisted — try matching by order status collect_id (if collect_request_id equals Order._id)
    if (!statusDoc) {
      // If collect_request_id looks like an ObjectId of our Order._id, try find Order by _id and then OrderStatus
      if (/^[0-9a-fA-F]{24}$/.test(collect_request_id)) {
        statusDoc = await OrderStatus.findOne({ collect_id: collect_request_id });
      }
    }

    // Update OrderStatus depending on response
    const updatedFields = {};
    if (gwStatus) updatedFields.status = gwStatus; // e.g., success/pending/failed
    if (amount !== null) updatedFields.transaction_amount = Number(amount);
    // optionally map timestamp from details or jwt if present
    if (gatewayResp.details && gatewayResp.details.payment_time) {
      updatedFields.payment_time = new Date(gatewayResp.details.payment_time);
    }

    if (statusDoc) {
      await OrderStatus.findByIdAndUpdate(statusDoc._id, { $set: updatedFields }, { new: true });
    } else {
      // If no status doc exists for this collect_request_id, create one and try to associate with Order by collect_id if possible
      // Attempt to find order by custom_order_id==collect_request_id
      let order = await Order.findOne({ custom_order_id: collect_request_id });
      if (!order && /^[0-9a-fA-F]{24}$/.test(collect_request_id)) {
        order = await Order.findById(collect_request_id);
      }

      await OrderStatus.create({
        collect_id: order ? order._id : null,
        collect_request_id,
        order_amount: amount || null,
        transaction_amount: amount || null,
        status: gwStatus || 'unknown',
        payment_time: updatedFields.payment_time || null,
        gateway: 'edviron'
      });
    }

    return res.json({ success: true, gateway_response: gatewayResp });
  } catch (err) {
    logger.error('checkPaymentStatus error', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};
