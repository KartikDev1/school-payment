module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PAYMENT_API_KEY: process.env.PAYMENT_API_KEY,
  PG_KEY: process.env.PG_KEY,
  SCHOOL_ID: process.env.SCHOOL_ID,
  PAYMENT_API_BASE: process.env.PAYMENT_API_BASE || 'https://example-payment-gateway.test'
};
