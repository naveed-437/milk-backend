const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/response');

const PRODUCT_TABLE = 'milk_products';
const CUSTOMER_TABLE = 'customers';
const DELIVERY_TABLE = 'daily_deliveries';
const SUBSCRIPTION_TABLE = 'customer_subscriptions';

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      { count: totalProducts },
      { count: activeProducts },
      { count: inactiveProducts },
      { count: totalCustomers },
      { count: totalDeliveries },
      { count: totalSubscriptions },
      { count: activeSubscriptions },
    ] = await Promise.all([
      supabase.from(PRODUCT_TABLE).select('id', { count: 'exact' }),
      supabase.from(PRODUCT_TABLE).select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from(PRODUCT_TABLE).select('id', { count: 'exact' }).eq('is_active', false),
      supabase.from(CUSTOMER_TABLE).select('id', { count: 'exact' }),
      supabase.from(DELIVERY_TABLE).select('id', { count: 'exact' }),
      supabase.from(SUBSCRIPTION_TABLE).select('id', { count: 'exact' }),
      supabase.from(SUBSCRIPTION_TABLE).select('id', { count: 'exact' }).eq('is_active', true),
    ]);

    const stats = {
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      inactiveProducts: inactiveProducts || 0,
      totalCustomers: totalCustomers || 0,
      totalDeliveries: totalDeliveries || 0,
      totalSubscriptions: totalSubscriptions || 0,
      activeSubscriptions: activeSubscriptions || 0,
    };

    return sendSuccess(res, stats);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

exports.healthCheck = async (req, res) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return sendError(res, 'Supabase environment is not configured.', 500);
    }

    const productCheck = await supabase.from(PRODUCT_TABLE).select('id').limit(1);
    const customerCheck = await supabase.from(CUSTOMER_TABLE).select('id').limit(1);
    const deliveryCheck = await supabase.from(DELIVERY_TABLE).select('id').limit(1);
    const subscriptionCheck = await supabase.from(SUBSCRIPTION_TABLE).select('id').limit(1);

    const errors = [productCheck, customerCheck, deliveryCheck, subscriptionCheck].filter((check) => check.error);
    if (errors.length) {
      return sendError(res, `Supabase query failed: ${errors.map((check) => check.error.message).join(', ')}`,
        500);
    }

    return sendSuccess(res, {
      uploads: true,
      database: true,
      productTable: PRODUCT_TABLE,
      customerTable: CUSTOMER_TABLE,
      deliveryTable: DELIVERY_TABLE,
      subscriptionTable: SUBSCRIPTION_TABLE,
      sampleLoaded: Boolean((productCheck.data || []).length),
    });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};
