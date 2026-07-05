const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/response');

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (typeof password !== 'string' || password.length < minLength) {
    return 'Password must be at least 8 characters long.';
  }
  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return 'Password must include uppercase, lowercase, number, and special character.';
  }

  return null;
};

const formatUser = (user, fallback = {}) => ({
  id: user?.id || fallback.id || '',
  name: user?.user_metadata?.name || fallback.name || '',
  email: user?.email || fallback.email || '',
  phone: user?.user_metadata?.phone || fallback.phone || '',
  role: user?.user_metadata?.role || fallback.role || 'customer',
});

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return sendError(res, 'Name, email, phone, and password are required.', 400);
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return sendError(res, passwordError, 400);
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          name: name.trim(),
          phone: phone.trim(),
          role: role === 'admin' ? 'admin' : 'customer',
        },
      },
    });

    if (error) {
      return sendError(res, error.message, 400);
    }

    let session = data.session;
    if (!session && data.user) {
      const signInResponse = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (!signInResponse.error) {
        session = signInResponse.data.session;
      }
    }

    return sendSuccess(res, {
      message: 'Registration successful.',
      user: formatUser(data.user, {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        role: role === 'admin' ? 'admin' : 'customer',
      }),
      token: session?.access_token || null,
    }, 201);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required.', 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      return sendError(res, error.message, 401);
    }

    return sendSuccess(res, {
      message: 'Login successful.',
      user: formatUser(data.user),
      token: data.session?.access_token || null,
    });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.getProfile = async (req, res) => {
  try {
    return sendSuccess(res, {
      message: 'Profile fetched successfully.',
      user: {
        id: req.user.id,
        name: req.user.name || '',
        email: req.user.email || '',
        phone: req.user.phone || '',
        role: req.user.role || 'customer',
      },
    });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    const updates = {};

    if (name) {
      updates.data = { ...(updates.data || {}), name: name.trim() };
    }

    if (phone) {
      updates.data = { ...(updates.data || {}), phone: phone.trim() };
    }

    if (email) {
      updates.email = email.toLowerCase().trim();
    }

    if (password) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        return sendError(res, passwordError, 400);
      }
      updates.password = password;
    }

    if (Object.keys(updates).length === 0) {
      return sendSuccess(res, {
        message: 'No changes provided.',
        user: formatUser(req.user),
      });
    }

    const { data, error } = await supabase.auth.updateUser(updates, {
      access_token: token,
    });

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, {
      message: 'Profile updated successfully.',
      user: formatUser(data.user),
    });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.logout = async (req, res) => {
  try {
    await supabase.auth.signOut();
    return sendSuccess(res, {
      message: 'Logout successful.',
    });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};
