const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

const sendError = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({ success: false, error });
};

module.exports = { sendSuccess, sendError };
