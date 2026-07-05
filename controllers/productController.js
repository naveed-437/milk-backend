const supabase = require("../config/supabase");
const { sendSuccess, sendError } = require("../utils/response");
const { normalizePayload, validateRequiredFields } = require("../utils/validation");

const PRODUCT_TABLE = "milk_products";
const productFieldCache = {};

const getProductField = async (field) => {
  if (productFieldCache[field] !== undefined) return productFieldCache[field];

  const { data, error } = await supabase.from(PRODUCT_TABLE).select(field).limit(1);

  if (error) {
    productFieldCache[field] = false;
    return false;
  }

  productFieldCache[field] = true;
  return true;
};

const buildProductPayload = async (body) => {
  const payload = normalizePayload(body);
  const hasCategory = await getProductField('category');
  const hasUnit = !hasCategory && (await getProductField('unit'));
  const hasPrice = await getProductField('price');
  const hasPricePerUnit = !hasPrice && (await getProductField('price_per_unit'));
  const hasStockQuantity = await getProductField('stock_quantity');
  const hasDescription = await getProductField('description');
  const hasImageUrl = await getProductField('image_url');
  const hasIsActive = await getProductField('is_active');

  const requiredFields = ['product_name'];
  if (hasCategory || hasUnit) requiredFields.push('category');
  if (hasPricePerUnit) {
    requiredFields.push('price_per_unit');
  } else if (hasPrice) {
    requiredFields.push('price');
  }

  const missingFields = validateRequiredFields(payload, requiredFields);
  if (missingFields.length) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  const built = {};
  if (await getProductField('product_name')) built.product_name = payload.product_name?.toString().trim();
  if (hasCategory) built.category = payload.category?.toString().trim() || null;
  if (hasUnit) built.unit = payload.category?.toString().trim() || null;
  if (hasStockQuantity) built.stock_quantity = Number(payload.stock_quantity) || 0;
  if (hasPricePerUnit) built.price_per_unit = Number(payload.price_per_unit || payload.price || 0);
  if (hasPrice) built.price = Number(payload.price || payload.price_per_unit || 0);
  if (hasDescription) built.description = payload.description?.toString().trim() || null;
  if (hasImageUrl) built.image_url = payload.image_url?.toString().trim() || null;
  if (hasIsActive) built.is_active = payload.is_active !== undefined ? Boolean(payload.is_active) : true;

  return built;
};

exports.createProduct = async (req, res) => {
  try {
    const payload = await buildProductPayload(req.body);
    const hasImageUrl = await getProductField('image_url');
    const baseUrl = process.env.SERVER_URL || 'http://127.0.0.1:5000';

    if (req.file && hasImageUrl) {
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
    const hasCategory = await getProductField('category');
    const hasUnit = !hasCategory && (await getProductField('unit'));
    const filterField = hasCategory ? 'category' : hasUnit ? 'unit' : null;

    let query = supabase.from(PRODUCT_TABLE).select('*', { count: 'exact' });

    if (search) {
      query = query.or(`product_name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category && filterField) {
      query = query.eq(filterField, category);
    }

    const { data, error, count } = await query
      .order('id', { ascending: false })
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
    const hasCategory = await getProductField('category');
    const hasUnit = !hasCategory && (await getProductField('unit'));
    const labelField = hasCategory ? 'category' : hasUnit ? 'unit' : null;

    if (!labelField) {
      return sendSuccess(res, { categories: [] });
    }

    const { data, error } = await supabase.from(PRODUCT_TABLE).select(labelField);

    if (error) {
      return sendError(res, error.message, 400);
    }

    const categories = Array.from(new Set((data || []).map((item) => item[labelField]).filter(Boolean))).sort();

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
    const payload = await buildProductPayload(req.body);
    const hasImageUrl = await getProductField('image_url');
    const baseUrl = process.env.SERVER_URL || 'http://127.0.0.1:5000';

    if (req.file && hasImageUrl) {
      payload.image_url = `${baseUrl}/uploads/products/${req.file.filename}`;
    }

    const { data, error } = await supabase.from(PRODUCT_TABLE).update(payload).eq('id', id).select();

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