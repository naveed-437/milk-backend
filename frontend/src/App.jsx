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

function App() {
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

  const sections = ['Dashboard', 'Customers', 'Products', 'Deliveries', 'Subscriptions'];

  const sectionConfig = {
    Dashboard: {
      title: 'Dashboard',
    },
    Customers: {
      endpoint: '/api/customers',
      list: customers,
      setList: setCustomers,
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

  const currentConfig = sectionConfig[selectedSection];

  const refreshData = async () => {
    setLoading(true);
    setError('');
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
      setFormData(currentConfig.initialForm);
      setEditingId(null);
      setStatusMessage('');
      setError('');
    }
  }, [selectedSection]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
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

    try {
      setError('');
      const endpoint = editingId ? `${currentConfig.endpoint}/${editingId}` : currentConfig.endpoint;
      const method = editingId ? 'PUT' : 'POST';

      await apiRequest(endpoint, method, payload);
      await refreshData();
      setStatusMessage(editingId ? 'Record updated successfully.' : 'Record created successfully.');
      setEditingId(null);
      setFormData(currentConfig.initialForm);
    } catch (err) {
      setError(err.message);
      setStatusMessage('');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setSelectedSection(selectedSection);
    setStatusMessage('Editing record. Save to update.');
  };

  const handleDelete = async (item) => {
    if (!currentConfig) return;

    const confirmed = window.confirm('Delete this record? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setError('');
      await apiRequest(`${currentConfig.endpoint}/${item.id}`, 'DELETE');
      await refreshData();
      setStatusMessage('Record deleted successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const renderTable = () => {
    if (!currentConfig || selectedSection === 'Dashboard') {
      return null;
    }

    const list = currentConfig.list || [];

    return (
      <div className="table-card">
        <div className="panel-title-row">
          <h2>{selectedSection} List</h2>
          <span>{list.length} records</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                {currentConfig.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  {currentConfig.rowValue(item).map((value, index) => (
                    <td key={index}>{value ?? '-'}</td>
                  ))}
                  <td className="actions-cell">
                    <button type="button" className="button secondary" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button type="button" className="button danger" onClick={() => handleDelete(item)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (!currentConfig || selectedSection === 'Dashboard') {
      return null;
    }

    return (
      <div className="form-card">
        <div className="panel-title-row">
          <div>
            <h2>{editingId ? `Edit ${selectedSection.slice(0, -1)}` : `Add ${selectedSection.slice(0, -1)}`}</h2>
            <span>Use the form below to create or update records.</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="crud-form">
          <div className="grid-form">
            {currentConfig.fields.map((field) => (
              <label key={field.name} className={field.type === 'checkbox' ? 'checkbox-label' : ''}>
                <span>{field.label}</span>
                {field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={Boolean(formData[field.name])}
                    onChange={(event) => handleFormChange(field.name, event.target.checked)}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] ?? ''}
                    onChange={(event) => handleFormChange(field.name, event.target.value)}
                    required={field.type !== 'checkbox'}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="button primary">
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              className="button outline"
              onClick={() => {
                setFormData(currentConfig.initialForm);
                setEditingId(null);
                setStatusMessage('Form reset.');
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">ASN Dairy Hub</p>
          <h1>Full CRUD Management</h1>
          <p className="hero-copy">Manage customers, products, deliveries and subscriptions directly from the frontend.</p>
        </div>
        <nav className="nav-tabs">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              className={selectedSection === section ? 'tab active' : 'tab'}
              onClick={() => handleSectionChange(section)}
            >
              {section}
            </button>
          ))}
        </nav>
      </header>

      {statusMessage && <p className="status success">{statusMessage}</p>}
      {error && <p className="status error">{error}</p>}

      {loading ? (
        <p className="status">Loading application data...</p>
      ) : selectedSection === 'Dashboard' ? (
        <>
          <section className="stats-grid">
            <article className="stat-card">
              <span>Customers</span>
              <strong>{customers.length}</strong>
            </article>
            <article className="stat-card">
              <span>Products</span>
              <strong>{products.length}</strong>
            </article>
            <article className="stat-card">
              <span>Deliveries</span>
              <strong>{deliveries.length}</strong>
            </article>
            <article className="stat-card">
              <span>Subscriptions</span>
              <strong>{subscriptions.length}</strong>
            </article>
          </section>

          <section className="panel-grid">
            <div className="panel">
              <div className="panel-title-row">
                <h2>Customers</h2>
                <span>Primary contacts</span>
              </div>
              <ul className="item-list">
                {customers.slice(0, 5).map((customer) => (
                  <li key={customer.id}>
                    <strong>{customer.name}</strong>
                    <span>{customer.phone}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel">
              <div className="panel-title-row">
                <h2>Products</h2>
                <span>Inventory</span>
              </div>
              <ul className="item-list">
                {products.slice(0, 5).map((product) => (
                  <li key={product.id}>
                    <strong>{product.product_name}</strong>
                    <span>₹{product.price_per_unit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      ) : (
        <div className="content-grid">
          {renderForm()}
          {renderTable()}
        </div>
      )}
    </div>
  );
}

export default App;
