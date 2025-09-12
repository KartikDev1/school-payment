const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    let exists = await User.findOne({ email });
    if(exists) return res.status(400).json({ message: 'Email already registered' });
    const user = new User({ email, password });
    await user.save();
    return res.status(201).json({ message: 'Registered' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if(!match) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
