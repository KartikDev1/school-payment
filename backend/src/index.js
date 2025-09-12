require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');
const transactionRoutes = require('./routes/transactions');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
// capture raw body for webhook signature verification
app.use(express.json({
  limit: '1mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

app.use(morgan('dev'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes); // webhook should be public
app.use('/api', transactionRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.log('MongoDB connected');
    const port = config.PORT || 5000;
    app.listen(port, () => logger.log(`Server listening on port ${port}`));
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
