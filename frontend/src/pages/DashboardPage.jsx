import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import DashboardStatCard from '../components/DashboardStatCard';
import DashboardHealthCard from '../components/DashboardHealthCard';
import DashboardTable from '../components/DashboardTable';
import Toast from '../components/Toast';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [overview, setOverview] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      setToast({ type: 'error', message: 'Unable to load dashboard stats.' });
    }
  };

  const fetchHealth = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/health');
      setHealth(response.data.data);
    } catch (error) {
      setToast({ type: 'error', message: 'Unable to load upload health.' });
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/overview');
      setOverview(response.data.data);
    } catch (error) {
      setToast({ type: 'error', message: 'Unable to load backend overview data.' });
    }
  };

  useEffect(() => {
    fetchStats();
    fetchHealth();
    fetchOverview();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="app-shell" style={{ paddingTop: 40 }}>
      <div className="panel-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Overview of products and backend inventory health.</h1>
          <span>Product, customer, delivery, and subscription metrics in one place.</span>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} />}

      <div className="stats-grid">
        <DashboardStatCard
          title="Total Products"
          value={stats?.totalProducts ?? '—'}
          description="Full catalog size in Supabase."
          onClick={() => navigate('/products')}
        />
        <DashboardStatCard
          title="Active Products"
          value={stats?.activeProducts ?? '—'}
          description="Products currently available for sale."
          onClick={() => navigate('/products')}
        />
        <DashboardStatCard
          title="Inactive Products"
          value={stats?.inactiveProducts ?? '—'}
          description="Products hidden from the catalog."
          onClick={() => navigate('/products')}
        />
        <DashboardStatCard
          title="Customers"
          value={stats?.totalCustomers ?? '—'}
          description="Registered customers in the system."
        />
        <DashboardStatCard
          title="Deliveries"
          value={stats?.totalDeliveries ?? '—'}
          description="Total deliveries recorded."
        />
        <DashboardStatCard
          title="Subscriptions"
          value={stats?.totalSubscriptions ?? '—'}
          description="Customer subscriptions recorded."
        />
        <DashboardStatCard
          title="Active Subscriptions"
          value={stats?.activeSubscriptions ?? '—'}
          description="Subscriptions that are currently active."
        />
      </div>

      <div className="health-grid">
        <DashboardHealthCard
          label="Uploads Available"
          active={Boolean(health?.uploads)}
          detail={health?.uploads ? 'Uploads folder is accessible.' : 'Unable to verify uploads.'}
          onClick={() => navigate('/products')}
        />
        <DashboardHealthCard
          label="Database Connection"
          active={Boolean(health?.database)}
          detail={health?.database ? 'Supabase query succeeded.' : 'Unable to connect to Supabase.'}
          onClick={() => navigate('/products')}
        />
        <DashboardHealthCard
          label="Product Table"
          active={Boolean(health?.productTable)}
          detail={health?.productTable ? `Table ${health.productTable} found.` : 'Product table not found.'}
          onClick={() => navigate('/products')}
        />
      </div>

      <div className="dashboard-overview-grid">
        <DashboardTable
          title="Recent Products"
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'product_name', header: 'Name' },
            { key: 'category', header: 'Category' },
            { key: 'stock_quantity', header: 'Stock' },
            { key: 'price', header: 'Price' },
          ]}
          rows={overview?.products || []}
        />
        <DashboardTable
          title="Recent Customers"
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'name', header: 'Name' },
            { key: 'phone', header: 'Phone' },
            { key: 'address', header: 'Address' },
          ]}
          rows={overview?.customers || []}
        />
        <DashboardTable
          title="Recent Deliveries"
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'customer_id', header: 'Customer' },
            { key: 'product_id', header: 'Product' },
            { key: 'delivery_date', header: 'Date' },
            { key: 'quantity', header: 'Qty' },
          ]}
          rows={overview?.deliveries || []}
        />
        <DashboardTable
          title="Recent Subscriptions"
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'customer_id', header: 'Customer' },
            { key: 'product_id', header: 'Product' },
            { key: 'morning_quantity', header: 'Morning' },
            { key: 'evening_quantity', header: 'Evening' },
            { key: 'is_active', header: 'Active' },
          ]}
          rows={overview?.subscriptions || []}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
