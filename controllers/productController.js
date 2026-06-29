const supabase = require("../config/supabase");

// Create Product
exports.createProduct = async (req, res) => {
  const { product_name, unit, price_per_unit } = req.body;

  const { data, error } = await supabase
    .from("milk_products")
    .insert([{ product_name, unit, price_per_unit }])
    .select();

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  res.status(201).json({ success: true, data });
};

// Get All Products
exports.getProducts = async (req, res) => {
  const { data, error } = await supabase
    .from("milk_products")
    .select("*")
    .order("id");

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  res.json({ success: true, data });
};

// Get Product By ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("milk_products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ success: false, error: error.message });
  }

  res.json({ success: true, data });
};

exports.getSubscriptionById = async (req, res) => {
  console.log("Subscription ID:", req.params.id);

  const { id } = req.params;

  const { data, error } = await supabase
    .from("customer_subscriptions")
    .select("*")
    .eq("id", id)
    .single();

  console.log("Data:", data);
  console.log("Error:", error);

  if (error) {
    return res.status(404).json({
      success: false,
      error: error.message,
    });
  }

  res.json({
    success: true,
    data,
  });
};
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { product_name, unit, price_per_unit, is_active } = req.body;

  const { data, error } = await supabase
    .from("milk_products")
    .update({
      product_name,
      unit,
      price_per_unit,
      is_active,
    })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  res.json({
    success: true,
    data,
  });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("milk_products")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
};