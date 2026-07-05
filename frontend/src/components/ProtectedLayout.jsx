import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const ProtectedLayout = () => (
  <div className="app-layout">
    <Sidebar />
    <div className="app-content">
      <Outlet />
    </div>
  </div>
);

export default ProtectedLayout;
