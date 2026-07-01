const supabase = require("../config/supabase");
const { sendSuccess, sendError } = require("../utils/response");
const { normalizePayload, validateRequiredFields } = require("../utils/validation");

const PRODUCT_TABLE = "milk_products";

const buildProductPayload = (body) => {
  const payload = normalizePayload(body);
  const missingFields = validateRequiredFields(payload, [
    "product_name",
    "category",
    "stock_quantity",
    "price",
    "description",
  ]);

  if (missingFields.length) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  return {
    product_name: payload.product_name?.toString().trim(),
    category: payload.category?.toString().trim(),
    stock_quantity: Number(payload.stock_quantity),
    price: Number(payload.price),
    description: payload.description?.toString().trim(),
    image_url: payload.image_url?.toString().trim() || null,
    is_active: payload.is_active !== undefined ? Boolean(payload.is_active) : true,
  };
};

exports.createProduct = async (req, res) => {
  try {
    const payload = buildProductPayload(req.body);
    const baseUrl = process.env.SERVER_URL || 'http://127.0.0.1:5000';

    if (req.file) {
      payload.image_url = `${baseUrl}/uploads/products/${req.file.filename}`;
    }

    const { data, error } = await supabase.from(PRODUCT_TABLE).insert([payload]).select();

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data[0], 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, pageSize = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);

    let query = supabase.from(PRODUCT_TABLE).select("*", { count: "exact" });

    if (search) {
      query = query.or(`product_name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error, count } = await query
      .order("id", { ascending: false })
      .range(offset, offset + Number(pageSize) - 1);

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, {
      products: data || [],
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total: count || 0,
      },
    });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase.from(PRODUCT_TABLE).select("category");

    if (error) {
      return sendError(res, error.message, 400);
    }

    const categories = Array.from(new Set((data || []).map((item) => item.category).filter(Boolean))).sort();

    return sendSuccess(res, { categories });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from(PRODUCT_TABLE).select("*").eq("id", id).single();

    if (error) {
      return sendError(res, error.message, 404);
    }

    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = buildProductPayload(req.body);
    const baseUrl = process.env.SERVER_URL || 'http://127.0.0.1:5000';

    if (req.file) {
      payload.image_url = `${baseUrl}/uploads/products/${req.file.filename}`;
    }

    const { data, error } = await supabase.from(PRODUCT_TABLE).update(payload).eq("id", id).select();

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, data[0]);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from(PRODUCT_TABLE).delete().eq("id", id);

    if (error) {
      return sendError(res, error.message, 400);
    }

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};