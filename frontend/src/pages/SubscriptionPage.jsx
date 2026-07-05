import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';

const initialForm = {
  customer_id: '',
  product_id: '',
  morning_quantity: '',
  evening_quantity: '',
  is_active: true,
};

const SubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    window.setTimeout(() => setToast(null), 3500);
  };

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/subscriptions');
      setSubscriptions(response.data.data || []);
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to load subscriptions.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleChange = (field) => (event) => {
    const value = field === 'is_active' ? event.target.checked : event.target.value;
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSelect = (subscription) => {
    setSelectedSubscription(subscription);
    setFormData({
      customer_id: subscription.customer_id || '',
      product_id: subscription.product_id || '',
      morning_quantity: subscription.morning_quantity || '',
      evening_quantity: subscription.evening_quantity || '',
      is_active: subscription.is_active ?? true,
    });
  };

  const resetForm = () => {
    setSelectedSubscription(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.customer_id || !formData.product_id) {
      showToast({ type: 'error', message: 'Customer ID and product ID are required.' });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        customer_id: Number(formData.customer_id),
        product_id: Number(formData.product_id),
        morning_quantity: Number(formData.morning_quantity),
        evening_quantity: Number(formData.evening_quantity),
        is_active: Boolean(formData.is_active),
      };

      if (selectedSubscription) {
        await axiosInstance.put(`/subscriptions/${selectedSubscription.id}`, payload);
        showToast({ type: 'success', message: 'Subscription updated successfully.' });
      } else {
        await axiosInstance.post('/subscriptions', payload);
        showToast({ type: 'success', message: 'Subscription added successfully.' });
      }

      resetForm();
      fetchSubscriptions();
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to save subscription.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this subscription?');
    if (!confirmed) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/subscriptions/${id}`);
      showToast({ type: 'success', message: 'Subscription deleted successfully.' });
      if (selectedSubscription?.id === id) resetForm();
      fetchSubscriptions();
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to delete subscription.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="panel-header hero-panel compact-hero">
        <div className="hero-copy">
          <p className="eyebrow">Subscription Management</p>
          <h1>Manage recurring customer subscriptions.</h1>
          <p>Keep track of recurring milk orders, quantities, and active plans.</p>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} />}

      <div className="content-grid">
        <div className="form-card">
          <div className="panel-title-row">
            <div>
              <h2>{selectedSubscription ? 'Edit Subscription' : 'Add Subscription'}</h2>
              <span>{selectedSubscription ? 'Update subscription details.' : 'Create a new recurring subscription.'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="crud-form">
            <label>
              <span>Customer ID</span>
              <input type="number" value={formData.customer_id} onChange={handleChange('customer_id')} required />
            </label>
            <label>
              <span>Product ID</span>
              <input type="number" value={formData.product_id} onChange={handleChange('product_id')} required />
            </label>
            <label>
              <span>Morning quantity</span>
              <input type="number" value={formData.morning_quantity} onChange={handleChange('morning_quantity')} required />
            </label>
            <label>
              <span>Evening quantity</span>
              <input type="number" value={formData.evening_quantity} onChange={handleChange('evening_quantity')} required />
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.is_active} onChange={handleChange('is_active')} />
              <span>Active subscription</span>
            </label>
            <div className="form-actions">
              <button type="submit" className="button primary" disabled={loading}>
                {loading ? 'Saving…' : selectedSubscription ? 'Update Subscription' : 'Add Subscription'}
              </button>
              {selectedSubscription && (
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
              <h2>Subscription list</h2>
              <span>{subscriptions.length} plans loaded from the backend.</span>
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
                    <th>Morning</th>
                    <th>Evening</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-row">
                        No subscriptions found.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((subscription) => (
                      <tr key={subscription.id}>
                        <td>{subscription.customer_id}</td>
                        <td>{subscription.product_id}</td>
                        <td>{subscription.morning_quantity}</td>
                        <td>{subscription.evening_quantity}</td>
                        <td>{subscription.is_active ? 'Active' : 'Inactive'}</td>
                        <td className="actions-cell">
                          <button type="button" className="button secondary" onClick={() => handleSelect(subscription)}>
                            Edit
                          </button>
                          <button type="button" className="button danger" onClick={() => handleDelete(subscription.id)}>
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

export default SubscriptionPage;
