const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const logAudit = require('../utils/auditLogger');
const RefreshToken = require('../models/RefreshToken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


const createRefreshToken = async (user) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); 

  const refreshToken = new RefreshToken({
    userId: user._id,
    token: require('crypto').randomBytes(64).toString('hex'),
    expiryDate: expiry,
  });
  await refreshToken.save();
  return refreshToken.token;
};

exports.refreshToken = async (req, res) => {
  const { token: requestToken } = req.body;
  if (!requestToken) {
    return res.status(403).json({ message: "Refresh token is required" });
  }
  try {
    const refreshTokenDoc = await RefreshToken.findOne({ token: requestToken });
    if (!refreshTokenDoc) {
      return res.status(403).json({ message: "Refresh token is not valid" });
    }
    if (refreshTokenDoc.expiryDate < new Date()) {
      await RefreshToken.findByIdAndRemove(refreshTokenDoc._id);
      return res.status(403).json({ message: "Refresh token expired. Please login again." });
    }
    const newAccessToken = jwt.sign({ userId: refreshTokenDoc.userId }, JWT_SECRET, {
      expiresIn: "15m",
    });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      await logAudit({ userId: null, action: 'REGISTER_FAIL', detail: `Email already registered: ${email}`, req });
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = await new User({ email, passwordHash: await argon2.hash(password) }).save();
    await logAudit({ userId: user._id, action: 'REGISTER', detail: `User registered: ${email}`, req });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const auditDetails = (detail) => ({ userId: user?._id, action: 'LOGIN_FAIL', detail, req });
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      await logAudit(auditDetails(`Invalid login attempt for email: ${email}`));
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = await createRefreshToken(user);
    await logAudit({ userId: user._id, action: 'LOGIN', detail: `User logged in: ${email}`, req });
    res.json({ accessToken: token, refreshToken, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

