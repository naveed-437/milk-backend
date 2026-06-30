const test = require('node:test');
const assert = require('node:assert/strict');

const { sendSuccess, sendError } = require('../utils/response');
const { validateRequiredFields } = require('../utils/validation');

test('sendSuccess returns a consistent success payload', () => {
  const res = {
    statusCode: 0,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  sendSuccess(res, { ok: true }, 201);

  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.payload, { success: true, data: { ok: true } });
});

test('sendError returns a consistent error payload', () => {
  const res = {
    statusCode: 0,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  sendError(res, 'Validation failed', 400);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, { success: false, error: 'Validation failed' });
});

test('validateRequiredFields reports missing fields', () => {
  const missing = validateRequiredFields({ name: 'Asha' }, ['name', 'phone']);
  assert.deepEqual(missing, ['phone']);
});
