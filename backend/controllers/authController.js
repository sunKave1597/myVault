const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const logAudit = require('../utils/auditLogger');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await argon2.hash(password);

    const user = new User({ email, passwordHash });
    await user.save();

    await logAudit({
      userId: user._id,
      action: 'REGISTER',
      entity: 'User',
      entityId: user._id,
      detail: `User registered with email: ${email}`
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      await logAudit({
        userId: null,  // เพราะ user ไม่เจอ อาจเก็บเป็น null หรือ 'unknown'
        action: 'LOGIN_FAIL',
        entity: 'User',
        entityId: null,
        detail: `Failed login attempt with email: ${email} (user not found)`
      });
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      await logAudit({
        userId: user._id,
        action: 'LOGIN_FAIL',
        entity: 'User',
        entityId: user._id,
        detail: `Failed login attempt with email: ${email} (wrong password)`
      });
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    await logAudit({
      userId: user._id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user._id,
      detail: `User logged in with email: ${email}`
    });

    res.json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
