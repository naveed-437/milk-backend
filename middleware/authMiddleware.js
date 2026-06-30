const supabase = require('../config/supabase');
const { sendError } = require('../utils/response');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized, token missing.', 401);
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return sendError(res, 'Not authorized, token invalid or expired.', 401);
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || 'customer',
      name: data.user.user_metadata?.name || '',
      phone: data.user.user_metadata?.phone || '',
    };

    next();
  } catch (err) {
    return sendError(res, 'Not authorized, token invalid or expired.', 401);
  }
};
