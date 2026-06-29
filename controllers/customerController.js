const supabase = require("../config/supabase");

// CREATE
exports.createCustomer = async (req, res) => {
  const { name, phone, address } = req.body;

  const { data, error } = await supabase
    .from("customers")
    .insert([{ name, phone, address }])
    .select();

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  res.status(201).json({ success: true, data });
};

// READ ALL
exports.getCustomers = async (req, res) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  res.json({ success: true, data });
};

// READ ONE
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ success: false, error: error.message });
  }

  res.json({ success: true, data });
};

// UPDATE
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, address } = req.body;

  const { data, error } = await supabase
    .from("customers")
    .update({ name, phone, address })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  res.json({ success: true, data });
};

// DELETE
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  res.json({
    success: true,
    message: "Customer deleted successfully",
  });
};