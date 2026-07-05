import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';

const initialForm = {
  customer_id: '',
  product_id: '',
  delivery_date: '',
  session: '',
  quantity: '',
  price_per_unit: '',
  remarks: '',
};

const DeliveryPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    window.setTimeout(() => setToast(null), 3500);
  };

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/deliveries');
      setDeliveries(response.data.data || []);
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to load deliveries.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async () => {
    setLoadingLists(true);
    try {
      const [customerResponse, productResponse] = await Promise.all([
        axiosInstance.get('/customers'),
        axiosInstance.get('/products?page=1&pageSize=100'),
      ]);

      setCustomers(customerResponse.data.data || []);
      setProducts(productResponse.data.data?.products || []);
    } catch (error) {
      showToast({
        type: 'error',
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Unable to load customers or products for delivery selection.',
      });
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchLists();
  }, []);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSelect = (delivery) => {
    setSelectedDelivery(delivery);
    setFormData({
      customer_id: delivery.customer_id || '',
      product_id: delivery.product_id || '',
      delivery_date: delivery.delivery_date || '',
      session: delivery.session || '',
      quantity: delivery.quantity || '',
      price_per_unit: delivery.price_per_unit || '',
      remarks: delivery.remarks || '',
    });
  };

  const resetForm = () => {
    setSelectedDelivery(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.customer_id || !formData.product_id || !formData.delivery_date || !formData.quantity || !formData.price_per_unit) {
      showToast({ type: 'error', message: 'Customer, product, date, quantity and price are required.' });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        customer_id: Number(formData.customer_id),
        product_id: Number(formData.product_id),
        quantity: Number(formData.quantity),
        price_per_unit: Number(formData.price_per_unit),
      };

      if (selectedDelivery) {
        await axiosInstance.put(`/deliveries/${selectedDelivery.id}`, payload);
        showToast({ type: 'success', message: 'Delivery updated successfully.' });
      } else {
        await axiosInstance.post('/deliveries', payload);
        showToast({ type: 'success', message: 'Delivery added successfully.' });
      }

      resetForm();
      fetchDeliveries();
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to save delivery.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this delivery?');
    if (!confirmed) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/deliveries/${id}`);
      showToast({ type: 'success', message: 'Delivery deleted successfully.' });
      if (selectedDelivery?.id === id) resetForm();
      fetchDeliveries();
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to delete delivery.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="panel-header hero-panel compact-hero">
        <div className="hero-copy">
          <p className="eyebrow">Delivery Management</p>
          <h1>Track daily deliveries and schedule records.</h1>
          <p>Capture every drop, session, customer, and pricing detail from your route sheets.</p>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} />}

      <div className="content-grid">
        <div className="form-card">
          <div className="panel-title-row">
            <div>
              <h2>{selectedDelivery ? 'Edit Delivery' : 'Add Delivery'}</h2>
              <span>{selectedDelivery ? 'Update an existing delivery record.' : 'Create a new delivery record.'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="crud-form">
            <label>
              <span>Customer</span>
              <select value={formData.customer_id} onChange={handleChange('customer_id')} required>
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name ? `${customer.name} (#${customer.id})` : `#${customer.id}`}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Product</span>
              <select value={formData.product_id} onChange={handleChange('product_id')} required>
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.product_name ? `${product.product_name} (#${product.id})` : `#${product.id}`}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Delivery date</span>
              <input type="date" value={formData.delivery_date} onChange={handleChange('delivery_date')} required />
            </label>
            <label>
              <span>Session</span>
              <input type="text" value={formData.session} onChange={handleChange('session')} placeholder="Morning or Evening" />
            </label>
            <label>
              <span>Quantity</span>
              <input type="number" value={formData.quantity} onChange={handleChange('quantity')} required />
            </label>
            <label>
              <span>Price per unit</span>
              <input type="number" value={formData.price_per_unit} onChange={handleChange('price_per_unit')} required />
            </label>
            <label>
              <span>Remarks</span>
              <input type="text" value={formData.remarks} onChange={handleChange('remarks')} />
            </label>
            <div className="form-actions">
              <button type="submit" className="button primary" disabled={loading}>
                {loading ? 'Saving…' : selectedDelivery ? 'Update Delivery' : 'Add Delivery'}
              </button>
              {selectedDelivery && (
                <button type="button" className="button outline" onClick={resetForm} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="table-card">
          <div className="panel-title-row">
            <div>
              <h2>Delivery history</h2>
              <span>{deliveries.length} records loaded from the backend.</span>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Date</th>
                    <th>Session</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-row">
                        No deliveries found.
                      </td>
                    </tr>
                  ) : (
                    deliveries.map((delivery) => (
                      <tr key={delivery.id}>
                        <td>{delivery.customer_id}</td>
                        <td>{delivery.product_id}</td>
                        <td>{delivery.delivery_date}</td>
                        <td>{delivery.session || '-'}</td>
                        <td>{delivery.quantity}</td>
                        <td>₹{delivery.price_per_unit}</td>
                        <td>{delivery.remarks || '-'}</td>
                        <td className="actions-cell">
                          <button type="button" className="button secondary" onClick={() => handleSelect(delivery)}>
                            Edit
                          </button>
                          <button type="button" className="button danger" onClick={() => handleDelete(delivery.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
