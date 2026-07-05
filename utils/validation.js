const validateRequiredFields = (payload, fields) => {
  return fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === '';
  });
};

const normalizePayload = (payload) => {
  return Object.entries(payload || {}).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'string' && value.trim() === '' ? null : value;
    return acc;
  }, {});
};

module.exports = { validateRequiredFields, normalizePayload };
