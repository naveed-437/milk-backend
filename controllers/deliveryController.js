const supabase = require("../config/supabase");
const { sendSuccess, sendError } = require("../utils/response");
const { normalizePayload, validateRequiredFields } = require("../utils/validation");

const DELIVERY_TABLE = "daily_deliveries";

const buildDeliveryPayload = (body) => {
  const payload = normalizePayload(body);
  const missingFields = validateRequiredFields(payload, ["customer_id", "product_id", "delivery_date", "quantity", "price_per_unit"]);

  if (missingFields.length) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  return {
    customer_id: Number(payload.customer_id),
    product_id: Number(payload.product_id),
    delivery_date: payload.delivery_date,
    session: payload.session?.toString().trim() || null,
    quantity: Number(payload.quantity),
    price_per_unit: Number(payload.price_per_unit),
    remarks: payload.remarks?.toString().trim() || null,
  };
};

exports.createDelivery = async (req, res) => {
  try {
    const payload = buildDeliveryPayload(req.body);
    const { data, error } = await supabase.from(DELIVERY_TABLE).insert([payload]).select();

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data, 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.getDeliveries = async (req, res) => {
  try {
    const { data, error } = await supabase.from(DELIVERY_TABLE).select("*").order("delivery_date", { ascending: false });

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from(DELIVERY_TABLE).select("*").eq("id", id).single();

    if (error) {
      return sendError(res, error.message, 404);
    }

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = buildDeliveryPayload(req.body);
    const { data, error } = await supabase.from(DELIVERY_TABLE).update(payload).eq("id", id).select();

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from(DELIVERY_TABLE).delete().eq("id", id);

    if (error) {
      return sendError(res, error.message, 400);
    }

    return res.status(200).json({ success: true, message: "Delivery deleted successfully" });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};
