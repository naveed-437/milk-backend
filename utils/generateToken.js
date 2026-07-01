const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ASN_Dairy_Hub_Secret_ChangeMe';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

module.exports = generateToken;
