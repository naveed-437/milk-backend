import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((current) => ({
        ...current,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }));
    }
  }, [user]);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await updateProfile(formData);
      setToast({ type: 'success', message: response.message || 'Profile updated successfully.' });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Could not update profile.';
      setToast({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
      window.setTimeout(() => setToast(null), 3600);
    }
  };

  return (
    <div className="app-shell auth-shell">
      <div className="page-grid auth-grid">
        <div className="form-card auth-card profile-card">
          <div className="panel-title-row">
            <div>
              <h2>Profile</h2>
              <span>Manage your account details and update your information.</span>
            </div>
            <button type="button" className="button outline" onClick={logout}>
              Logout
            </button>
          </div>

          {toast && (
            <div className={`status ${toast.type === 'error' ? 'error' : 'success'}`}>
              {toast.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="crud-form">
            <label>
              <span>Name</span>
              <input type="text" value={formData.name} onChange={handleChange('name')} required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={formData.email} onChange={handleChange('email')} required />
            </label>
            <label>
              <span>Phone</span>
              <input type="tel" value={formData.phone} onChange={handleChange('phone')} required />
            </label>
            <label>
              <span>New Password</span>
              <input type="password" value={formData.password} onChange={handleChange('password')} placeholder="Leave blank to keep current password" />
            </label>
            <div className="form-actions">
              <button type="submit" className="button primary" disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
