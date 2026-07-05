const supabase = require('../config/supabase');

const tables = ['milk_products', 'customers', 'daily_deliveries', 'customer_subscriptions'];

async function seed() {
  console.log('Seeding demo data...');

  const products = [
    { product_name: 'Fresh Full Cream Milk', category: 'Dairy', stock_quantity: 120, price: 80, description: 'Fresh daily milk', is_active: true },
    { product_name: 'Butter', category: 'Dairy', stock_quantity: 45, price: 220, description: 'Creamy butter', is_active: true },
    { product_name: 'Yogurt', category: 'Dairy', stock_quantity: 60, price: 95, description: 'Natural yogurt', is_active: true },
  ];

  const customers = [
    { full_name: 'Ayesha Khan', phone: '03001234567', address: 'Block A, Lahore', email: 'ayesha@example.com' },
    { full_name: 'Bilal Ahmed', phone: '03007654321', address: 'Gulberg, Lahore', email: 'bilal@example.com' },
  ];

  const deliveries = [
    { customer_id: 1, product_id: 1, delivery_date: '2026-07-05', quantity: 2, status: 'Scheduled' },
    { customer_id: 2, product_id: 2, delivery_date: '2026-07-06', quantity: 1, status: 'Pending' },
  ];

  const subscriptions = [
    { customer_id: 1, product_id: 1, frequency: 'Daily', start_date: '2026-07-01', is_active: true },
    { customer_id: 2, product_id: 3, frequency: 'Weekly', start_date: '2026-07-01', is_active: true },
  ];

  for (const row of products) {
    await supabase.from('milk_products').insert([row]).select();
  }

  for (const row of customers) {
    await supabase.from('customers').insert([row]).select();
  }

  for (const row of deliveries) {
    await supabase.from('daily_deliveries').insert([row]).select();
  }

  for (const row of subscriptions) {
    await supabase.from('customer_subscriptions').insert([row]).select();
  }

  console.log('Demo data inserted');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
