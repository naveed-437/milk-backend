import { useEffect, useState } from 'react';

const API_BASE = 'http://127.0.0.1:5000';

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Request failed');
  }

  return result.data || [];
};

function LegacyDashboard() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const sections = ['Dashboard', 'Customers', 'Products', 'Deliveries', 'Subscriptions'];

  const sectionConfig = {
    Dashboard: {
      title: 'Dashboard',
      description: 'Track your dairy business with quick summaries and recent activity from every section.',
    },
    Customers: {
      endpoint: '/api/customers',
      list: customers,
      setList: setCustomers,
      description: 'Add and manage customer contacts with quick search and easy editing.',
      initialForm: { name: '', phone: '', address: '' },
      fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'address', label: 'Address', type: 'text' },
      ],
      columns: ['Name', 'Phone', 'Address'],
      rowValue: (item) => [item.name, item.phone, item.address],
    },
    Products: {
      endpoint: '/api/products',
      list: products,
      setList: setProducts,
      description: 'Maintain product catalog details and pricing for daily inventory management.',
      initialForm: { product_name: '', unit: '', price_per_unit: '', is_active: false },
      fields: [
        { name: 'product_name', label: 'Product Name', type: 'text' },
        { name: 'unit', label: 'Unit', type: 'text' },
        { name: 'price_per_unit', label: 'Price per Unit', type: 'number' },
        { name: 'is_active', label: 'Active', type: 'checkbox' },
      ],
      columns: ['Product', 'Unit', 'Price', 'Active'],
      rowValue: (item) => [item.product_name, item.unit, `₹${item.price_per_unit}`, item.is_active ? 'Yes' : 'No'],
    },
    Deliveries: {
      endpoint: '/api/deliveries',
      list: deliveries,
      setList: setDeliveries,
      description: 'Record daily deliveries with customer, product, quantity and session details.',
      initialForm: {
        customer_id: '',
        product_id: '',
        delivery_date: '',
        session: '',
        quantity: '',
        price_per_unit: '',
        remarks: '',
      },
      fields: [
        { name: 'customer_id', label: 'Customer ID', type: 'number' },
        { name: 'product_id', label: 'Product ID', type: 'number' },
        { name: 'delivery_date', label: 'Delivery Date', type: 'date' },
        { name: 'session', label: 'Session', type: 'text' },
        { name: 'quantity', label: 'Quantity', type: 'number' },
        { name: 'price_per_unit', label: 'Price per Unit', type: 'number' },
        { name: 'remarks', label: 'Remarks', type: 'text' },
      ],
      columns: ['Customer ID', 'Product ID', 'Date', 'Session', 'Qty', 'Price'],
      rowValue: (item) => [item.customer_id, item.product_id, item.delivery_date, item.session, item.quantity, `₹${item.price_per_unit}`],
    },
    Subscriptions: {
      endpoint: '/api/subscriptions',
      list: subscriptions,
      setList: setSubscriptions,
      description: 'Manage recurring subscription plans to keep customer milk orders on schedule.',
      initialForm: {
        customer_id: '',
        product_id: '',
        morning_quantity: '',
        evening_quantity: '',
        is_active: false,
      },
      fields: [
        { name: 'customer_id', label: 'Customer ID', type: 'number' },
        { name: 'product_id', label: 'Product ID', type: 'number' },
        { name: 'morning_quantity', label: 'Morning Qty', type: 'number' },
        { name: 'evening_quantity', label: 'Evening Qty', type: 'number' },
        { name: 'is_active', label: 'Active', type: 'checkbox' },
      ],
      columns: ['Customer ID', 'Product ID', 'Morning', 'Evening', 'Status'],
      rowValue: (item) => [item.customer_id, item.product_id, item.morning_quantity, item.evening_quantity, item.is_active ? 'Active' : 'Inactive'],
    },
  };

  const sectionIcons = {
    Dashboard: '📊',
    Customers: '👥',
    Products: '🧾',
    Deliveries: '🚚',
    Subscriptions: '🔁',
  };

  const currentConfig = sectionConfig[selectedSection];

  const sectionSummary = {
    Dashboard: 'A live snapshot of your dairy business activity and recent records.',
    Customers: `${customers.length} customers stored`,
    Products: `${products.length} products available`,
    Deliveries: `${deliveries.length} deliveries recorded`,
    Subscriptions: `${subscriptions.filter((item) => item.is_active).length} active subscriptions`,
  };

  const refreshData = async () => {
    setLoading(true);
    setError('');
    setValidationError('');
    setStatusMessage('');

    try {
      const [customerData, productData, deliveryData, subscriptionData] = await Promise.all([
        apiRequest('/api/customers'),
        apiRequest('/api/products'),
        apiRequest('/api/deliveries'),
        apiRequest('/api/subscriptions'),
      ]);

      setCustomers(customerData || []);
      setProducts(productData || []);
      setDeliveries(deliveryData || []);
      setSubscriptions(subscriptionData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (selectedSection !== 'Dashboard' && currentConfig) {
      setFormData({ ...currentConfig.initialForm });
      setEditingId(null);
      setStatusMessage('');
      setError('');
      setValidationError('');
      setSearchTerm('');
    }
  }, [selectedSection]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const validateForm = (payload) => {
    if (selectedSection === 'Customers') {
      if (!payload.name?.toString().trim()) return 'Customer name is required.';
      if (!payload.phone?.toString().trim()) return 'Phone number is required.';
      if (payload.phone.toString().trim().length < 10) return 'Phone number must be at least 10 digits.';
      if (!payload.address?.toString().trim()) return 'Address is required.';
    }

    if (selectedSection === 'Products') {
      if (!payload.product_name?.toString().trim()) return 'Product name is required.';
      if (!payload.unit?.toString().trim()) return 'Unit is required.';
      if (!payload.price_per_unit || Number(payload.price_per_unit) <= 0) return 'Price must be greater than zero.';
    }

    if (selectedSection === 'Deliveries') {
      if (!payload.customer_id || Number(payload.customer_id) <= 0) return 'Valid customer ID is required.';
      if (!payload.product_id || Number(payload.product_id) <= 0) return 'Valid product ID is required.';
      if (!payload.delivery_date) return 'Delivery date is required.';
      if (!payload.quantity || Number(payload.quantity) <= 0) return 'Quantity must be greater than zero.';
      if (!payload.price_per_unit || Number(payload.price_per_unit) <= 0) return 'Price must be greater than zero.';
    }

    if (selectedSection === 'Subscriptions') {
      if (!payload.customer_id || Number(payload.customer_id) <= 0) return 'Valid customer ID is required.';
      if (!payload.product_id || Number(payload.product_id) <= 0) return 'Valid product ID is required.';
      if (!payload.morning_quantity && Number(payload.morning_quantity) !== 0) return 'Morning quantity is required.';
      if (!payload.evening_quantity && Number(payload.evening_quantity) !== 0) return 'Evening quantity is required.';
    }

    return null;
  };

  const preparePayload = (data) => {
    return Object.entries(data).reduce((payload, [key, value]) => {
      payload[key] = typeof value === 'string' && value.trim() === '' ? null : value;
      return payload;
    }, {});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentConfig) return;

    const payload = preparePayload(formData);

    if (currentConfig.endpoint === '/api/products') {
      payload.price_per_unit = Number(payload.price_per_unit);
      payload.is_active = Boolean(payload.is_active);
    }

    if (currentConfig.endpoint === '/api/deliveries') {
      payload.customer_id = Number(payload.customer_id);
      payload.product_id = Number(payload.product_id);
      payload.quantity = Number(payload.quantity);
      payload.price_per_unit = Number(payload.price_per_unit);
    }

    if (currentConfig.endpoint === '/api/subscriptions') {
      payload.customer_id = Number(payload.customer_id);
      payload.product_id = Number(payload.product_id);
      payload.morning_quantity = Number(payload.morning_quantity);
      payload.evening_quantity = Number(payload.evening_quantity);
      payload.is_active = Boolean(payload.is_active);
    }

    const validationMessage = validateForm(payload);
    if (validationMessage) {
      setValidationError(validationMessage);
      setError('');
      setStatusMessage('');
      return;
    }

    setValidationError('');

    try {
      setError('');
      const endpoint = editingId ? `${currentConfig.endpoint}/${editingId}` : currentConfig.endpoint;
      const method = editingId ? 'PUT' : 'POST';

      await apiRequest(endpoint, method, payload);
      await refreshData();
      const successMessage = editingId ? 'Record updated successfully.' : 'Record created successfully.';
      setStatusMessage(successMessage);
      showToast(successMessage, 'success');
      setEditingId(null);
      setFormData(currentConfig.initialForm);
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
      setStatusMessage('');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setSelectedSection(selectedSection);
    setValidationError('');
    setStatusMessage('Editing record. Save to update.');
  };

  const handleDelete = async (item) => {
    if (!currentConfig) return;

    const confirmed = window.confirm('Delete this record? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setError('');
      setValidationError('');
      await apiRequest(`${currentConfig.endpoint}/${item.id}`, 'DELETE');
      await refreshData();
      const deleteMessage = 'Record deleted successfully.';
      setStatusMessage(deleteMessage);
      showToast(deleteMessage, 'success');