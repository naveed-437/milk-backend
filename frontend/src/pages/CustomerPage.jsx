import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';

const initialForm = {
  name: '',
  phone: '',
  address: '',
};

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    window.setTimeout(() => setToast(null), 3500);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/customers');
      setCustomers(response.data.data || []);
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to load customers.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSelect = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name || '',
      phone: customer.phone || '',
      address: customer.address || '',
    });
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast({ type: 'error', message: 'Name, phone, and address are required.' });
      return;
    }

    try {
      setLoading(true);
      if (selectedCustomer) {
        await axiosInstance.put(`/customers/${selectedCustomer.id}`, formData);
        showToast({ type: 'success', message: 'Customer updated successfully.' });
      } else {
        await axiosInstance.post('/customers', formData);
        showToast({ type: 'success', message: 'Customer added successfully.' });
      }
      resetForm();
      fetchCustomers();
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to save customer.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this customer?');
    if (!confirmed) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/customers/${id}`);
      showToast({ type: 'success', message: 'Customer deleted successfully.' });
      if (selectedCustomer?.id === id) resetForm();
      fetchCustomers();
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to delete customer.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="panel-header hero-panel compact-hero">
        <div className="hero-copy">
          <p className="eyebrow">Customer Management</p>
          <h1>Manage customers, addresses, and contact details.</h1>
          <p>Track customer information and keep delivery contacts up to date with a cleaner workspace.</p>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} />}

      <div className="content-grid">
        <div className="form-card">
          <div className="panel-title-row">
            <div>
              <h2>{selectedCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
              <span>{selectedCustomer ? 'Update contact details.' : 'Create a new customer profile.'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="crud-form">
            <label>
              <span>Name</span>
              <input type="text" value={formData.name} onChange={handleChange('name')} required />
            </label>
            <label>
              <span>Phone</span>
              <input type="tel" value={formData.phone} onChange={handleChange('phone')} required />
            </label>
            <label>
              <span>Address</span>
              <input type="text" value={formData.address} onChange={handleChange('address')} required />
            </label>
            <div className="form-actions">
              <button type="submit" className="button primary" disabled={loading}>
                {loading ? 'Saving…' : selectedCustomer ? 'Update Customer' : 'Add Customer'}
              </button>
              {selectedCustomer && (
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
              <h2>Customer list</h2>
              <span>{customers.length} records loaded from the backend.</span>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-row">
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.address}</td>
                        <td className="actions-cell">
                          <button type="button" className="button secondary" onClick={() => handleSelect(customer)}>
                            Edit
                          </button>
                          <button type="button" className="button danger" onClick={() => handleDelete(customer.id)}>
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

export default CustomerPage;
