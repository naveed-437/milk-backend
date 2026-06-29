const supabase = require("../config/supabase");

// Create Subscription
exports.createSubscription = async (req, res) => {
  try {
    const {
      customer_id,
      product_id,
      morning_quantity,
      evening_quantity,
      is_active
    } = req.body;

    const { data, error } = await supabase
      .from("customer_subscriptions")
      .insert([
        {
          customer_id,
          product_id,
          morning_quantity,
          evening_quantity,
          is_active
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get All Subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("customer_subscriptions")
      .select("*")
      .order("id");

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("customer_subscriptions")
      .select("*")
      .eq("id", id)
      .maybeSingle();


    if (error) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    res.status(200).json({
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

exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      customer_id,
      product_id,
      morning_quantity,
      evening_quantity,
      is_active,
    } = req.body;

    const { data, error } = await supabase
      .from("customer_subscriptions")
      .update({
        customer_id,
        product_id,
        morning_quantity,
        evening_quantity,
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

    res.status(200).json({
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

exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("customer_subscriptions")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};