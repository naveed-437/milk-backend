import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './components/ProtectedLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductPage';
import CustomerPage from './pages/CustomerPage';
import DeliveryPage from './pages/DeliveryPage';
import SubscriptionPage from './pages/SubscriptionPage';
import HelpPage from './pages/Help';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/deliveries" element={<DeliveryPage />} />
            <Route path="/subscriptions" element={<SubscriptionPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/" element={<DashboardPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
