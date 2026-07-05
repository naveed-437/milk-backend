import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: '◉' },
    { to: '/products', label: 'Products', icon: '🧺' },
    { to: '/customers', label: 'Customers', icon: '👥' },
    { to: '/deliveries', label: 'Deliveries', icon: '🚚' },
    { to: '/subscriptions', label: 'Subscriptions', icon: '🔁' },
    { to: '/profile', label: 'Profile', icon: '⚙️' },
    { to: '/help', label: 'Help', icon: '❓' },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">🥛</div>
        <div>
          <span>ASN Dairy</span>
          <p>Premium operations hub</p>
        </div>
      </div>

      <div className="sidebar-user-card">
        <p className="sidebar-user-label">Signed in</p>
        <strong>{user?.name || 'Operations user'}</strong>
        <span>{user?.email || 'Manage your dairy workflow'}</span>
      </div>

      <ul className="sidebar-nav-list">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <button type="button" className="sidebar-logout" onClick={logout}>
        <span>↩</span>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
