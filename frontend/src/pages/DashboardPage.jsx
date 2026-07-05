import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import DashboardStatCard from '../components/DashboardStatCard';
import DashboardHealthCard from '../components/DashboardHealthCard';
import Toast from '../components/Toast';

const DashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);
  const [tokenStatus, setTokenStatus] = useState('unknown');
  const [toast, setToast] = useState(null);

  const fetchOverview = async () => {
    const token = localStorage.getItem('asnAuthToken');
    setTokenStatus(token ? 'present' : 'missing');

    if (!token) {
      setToast({ type: 'error', message: 'No auth token found. Please log in again.' });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get('/dashboard/overview');
      setOverview(response.data.data);
      setLastRefreshedAt(new Date().toLocaleString());
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Unable to load backend overview data.';
      setToast({ type: 'error', message });
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const products = overview?.products || [];
  const customers = overview?.customers || [];
  const deliveries = overview?.deliveries || [];
  const subscriptions = overview?.subscriptions || [];
  const activeSubscriptions = subscriptions.filter((item) => item.is_active).length;
  const inactiveSubscriptions = subscriptions.length - activeSubscriptions;

  return (
    <div className="app-shell dashboard-page" style={{ paddingTop: 40 }}>
      <div className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Operations dashboard</p>
          <h1>Milk delivery operations at a glance</h1>
          <p>Stay on top of inventory, customer activity, and recurring deliveries from a polished central workspace.</p>
          <div className="hero-tags">
            <span>Live backend snapshot</span>
            <span>Fast planning</span>
            <span>Clear insights</span>
          </div>
        </div>
        <div className="hero-actions">
          <button type="button" className="button primary" onClick={fetchOverview} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh data'}
          </button>
          <Link to="/products" className="button outline" style={{ textDecoration: 'none' }}>
            Manage products
          </Link>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} />}

      <div className="dashboard-actions">
        <div>
          <p className="section-label">Real-time backend snapshot</p>
          <p className="dashboard-meta">{lastRefreshedAt ? `Last refreshed ${lastRefreshedAt}` : 'Loading live data from your backend...'}</p>
        </div>
        <div className="dashboard-actions-right">
          <span className="pill-badge">{loading ? 'Syncing…' : 'Updated'}</span>
        </div>
      </div>

      <div className="dashboard-metrics-grid">
        <DashboardStatCard title="Products" value={products.length} description="Total products in inventory." icon="🥛" accent="blue" />
        <DashboardStatCard title="Customers" value={customers.length} description="Active customer profiles." icon="👤" accent="purple" />
        <DashboardStatCard title="Deliveries" value={deliveries.length} description="Latest delivery records." icon="🚚" accent="green" />
        <DashboardStatCard title="Subscriptions" value={subscriptions.length} description="Active and paused plans." icon="🔁" accent="orange" />
      </div>

      <div className="dashboard-status-grid">
        <DashboardHealthCard
          label="Auth token"
          active={tokenStatus === 'present'}
          detail={tokenStatus === 'present' ? 'Token is available' : 'Login required'}
          icon="🔐"
        />
        <DashboardHealthCard
          label="Subscription health"
          active={activeSubscriptions >= inactiveSubscriptions}
          detail={`${activeSubscriptions} active, ${inactiveSubscriptions} inactive`}
          icon="📈"
        />
        <DashboardHealthCard
          label="API status"
          active={!loading}
          detail={loading ? 'Refreshing overview' : 'Backend data ready'}
          icon="⚡"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
