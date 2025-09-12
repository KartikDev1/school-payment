const express = require('express');
const auth = require('../middleware/authMiddleware');
const transactionsController = require('../controllers/transactionsController');

const router = express.Router();

// Protected transactions listing
router.get('/transactions', auth, transactionsController.getTransactions);
router.get('/transactions/school/:schoolId', auth, transactionsController.getTransactionsBySchool);
router.get('/transaction-status/:custom_order_id', auth, transactionsController.checkTransactionStatus);

module.exports = router;
