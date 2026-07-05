import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="page-title">
        <span className="section-icon">🥛</span>
        <div>
          <p className="eyebrow">ASN Dairy Hub</p>
          <h1>Milk distribution management</h1>
        </div>
      </div>
      <nav className="topbar-nav">
        {user ? (
          <>
            <Link to="/" className="topbar-link">
              Dashboard
            </Link>
            <Link to="/products" className="topbar-link">
              Products
            </Link>
            <Link to="/help" className="topbar-link">
              Help
            </Link>
            <Link to="/customers" className="topbar-link">
              Customers
            </Link>
            <Link to="/deliveries" className="topbar-link">
              Deliveries
            </Link>
            <Link to="/subscriptions" className="topbar-link">
              Subscriptions
            </Link>
            <span className="user-pill">{user.name}</span>
            <button type="button" className="button outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="button outline" style={{ textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
