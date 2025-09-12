const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validateRequest');
const auth = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// create payment (protected)
router.post('/create',
  auth,
  [
    body('school_id').notEmpty(),
    body('amount').isNumeric(),
    body('custom_order_id').notEmpty()
  ],
  validate,
  paymentController.createPayment
);

// check payment status (protected) - wrapper around gateway GET
// Usage: GET /api/payment/status/:collect_request_id?school_id=XXXXX
router.get('/status/:collect_request_id', auth, paymentController.checkPaymentStatus);

module.exports = router;
