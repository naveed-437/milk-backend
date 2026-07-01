import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="app-sidebar">
      <div className="sidebar-brand">
        <span>ASN Dairy</span>
        <p>Management</p>
      </div>
      <ul className="sidebar-nav-list">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
