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
    <header className="page-header" style={{ alignItems: 'center' }}>
      <div className="page-title">
        <span className="section-icon">🥛</span>
        <div>
          <p className="eyebrow">ASN Dairy Hub</p>
          <h1>Milk distribution management</h1>
        </div>
      </div>
      <div className="page-actions" style={{ gap: '12px' }}>
        {user ? (
          <>
            <Link to="/" className="button outline" style={{ textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link to="/products" className="button outline" style={{ textDecoration: 'none' }}>
              Products
            </Link>
            <span style={{ color: '#334155', fontWeight: 600 }}>{user.name}</span>
            <button type="button" className="button outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="button outline" style={{ textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
