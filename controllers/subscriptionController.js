const supabase = require("../config/supabase");
const { sendSuccess, sendError } = require("../utils/response");
const { normalizePayload, validateRequiredFields } = require("../utils/validation");

const SUBSCRIPTION_TABLE = "customer_subscriptions";

const buildSubscriptionPayload = (body) => {
  const payload = normalizePayload(body);
  const missingFields = validateRequiredFields(payload, ["customer_id", "product_id", "morning_quantity", "evening_quantity"]);

  if (missingFields.length) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  return {
    customer_id: Number(payload.customer_id),
    product_id: Number(payload.product_id),
    morning_quantity: Number(payload.morning_quantity),
    evening_quantity: Number(payload.evening_quantity),
    is_active: Boolean(payload.is_active),
  };
};

exports.createSubscription = async (req, res) => {
  try {
    const payload = buildSubscriptionPayload(req.body);
    const { data, error } = await supabase.from(SUBSCRIPTION_TABLE).insert([payload]).select();

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data, 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const { data, error } = await supabase.from(SUBSCRIPTION_TABLE).select("*").order("id");

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from(SUBSCRIPTION_TABLE).select("*").eq("id", id).maybeSingle();

    if (error) {
      return sendError(res, error.message, 404);
    }

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = buildSubscriptionPayload(req.body);
    const { data, error } = await supabase.from(SUBSCRIPTION_TABLE).update(payload).eq("id", id).select();

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from(SUBSCRIPTION_TABLE).delete().eq("id", id);

    if (error) {
      return sendError(res, error.message, 400);
    }

    return res.status(200).json({ success: true, message: "Subscription deleted successfully" });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};