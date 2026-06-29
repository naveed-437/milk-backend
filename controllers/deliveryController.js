const supabase = require("../config/supabase");

// Create Delivery
exports.createDelivery = async (req, res) => {
  try {
    const {
      customer_id,
      product_id,
      delivery_date,
      session,
      quantity,
      price_per_unit,
      remarks,
    } = req.body;

    const { data, error } = await supabase
      .from("daily_deliveries")
      .insert([
        {
          customer_id,
          product_id,
          delivery_date,
          session,
          quantity,
          price_per_unit,
          remarks,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Get All Deliveries
exports.getDeliveries = async (req, res) => {
  const { data, error } = await supabase
    .from("daily_deliveries")
    .select("*")
    .order("delivery_date", { ascending: false });

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

exports.getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("daily_deliveries")
      .select("*")
      .eq("id", id)
      .single();

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
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      customer_id,
      product_id,
      delivery_date,
      session,
      quantity,
      price_per_unit,
      remarks,
    } = req.body;

    const { data, error } = await supabase
      .from("daily_deliveries")
      .update({
        customer_id,
        product_id,
        delivery_date,
        session,
        quantity,
        price_per_unit,
        remarks,
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
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("daily_deliveries")
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
      message: "Delivery deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
