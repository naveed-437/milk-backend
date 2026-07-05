const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/response');

const PRODUCT_TABLE = 'milk_products';
const CUSTOMER_TABLE = 'customers';
const DELIVERY_TABLE = 'daily_deliveries';
const SUBSCRIPTION_TABLE = 'customer_subscriptions';

exports.getDashboardOverview = async (req, res) => {
  try {
    const [
      productsResult,
      customersResult,
      deliveriesResult,
      subscriptionsResult,
    ] = await Promise.all([
      supabase.from(PRODUCT_TABLE).select('*').order('id', { ascending: false }).limit(20),
      supabase.from(CUSTOMER_TABLE).select('*').order('id', { ascending: false }).limit(20),
      supabase.from(DELIVERY_TABLE).select('*').order('delivery_date', { ascending: false }).limit(20),
      supabase.from(SUBSCRIPTION_TABLE).select('*').order('id', { ascending: false }).limit(20),
    ]);

    const errors = [productsResult, customersResult, deliveriesResult, subscriptionsResult].filter((result) => result.error);
    if (errors.length > 0) {
      return sendError(res, `Unable to load overview data: ${errors.map((result) => result.error.message).join(', ')}`);
    }

    return sendSuccess(res, {
      products: productsResult.data || [],
      customers: customersResult.data || [],
      deliveries: deliveriesResult.data || [],
      subscriptions: subscriptionsResult.data || [],
    });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};
