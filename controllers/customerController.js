const supabase = require("../config/supabase");
const { sendSuccess, sendError } = require("../utils/response");
const { normalizePayload, validateRequiredFields } = require("../utils/validation");

const CUSTOMER_TABLE = "customers";

const buildCustomerPayload = (body) => {
  const payload = normalizePayload(body);
  const missingFields = validateRequiredFields(payload, ["name", "phone", "address"]);

  if (missingFields.length) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  return {
    name: payload.name?.toString().trim(),
    phone: payload.phone?.toString().trim(),
    address: payload.address?.toString().trim(),
  };
};

exports.createCustomer = async (req, res) => {
  try {
    const payload = buildCustomerPayload(req.body);
    const { data, error } = await supabase.from(CUSTOMER_TABLE).insert([payload]).select();

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data, 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const { data, error } = await supabase.from(CUSTOMER_TABLE).select("*").order("id", { ascending: true });

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from(CUSTOMER_TABLE).select("*").eq("id", id).single();

    if (error) {
      return sendError(res, error.message, 404);
    }

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = buildCustomerPayload(req.body);
    const { data, error } = await supabase.from(CUSTOMER_TABLE).update(payload).eq("id", id).select();

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from(CUSTOMER_TABLE).delete().eq("id", id);

    if (error) {
      return sendError(res, error.message, 400);
    }

    return res.status(200).json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};