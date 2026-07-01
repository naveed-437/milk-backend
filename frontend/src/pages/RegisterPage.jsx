import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (field) => (event) => {
    setFormData((value) => ({ ...value, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, phone, password } = formData;
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setToast({ type: 'error', message: 'All fields are required.' });
      return;
    }

    try {
      setLoading(true);
      const response = await register({ ...formData });
      setToast({ type: 'success', message: response.message || 'Registration successful.' });
      navigate('/profile');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed.';
      setToast({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
      window.setTimeout(() => setToast(null), 3600);
    }
  };

  return (
    <div className="app-shell">
      <div className="page-grid" style={{ gridTemplateColumns: '1fr', padding: '40px 0' }}>
        <div className="form-card" style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className="panel-title-row">
            <div>
              <h2>Create your account</h2>
              <span>Register and start managing dairy delivery operations securely.</span>
            </div>
          </div>

          {toast && (
            <div className={`status ${toast.type === 'error' ? 'error' : 'success'}`}>
              {toast.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="crud-form">
            <label>
              <span>Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Full name"
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="+919876543210"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="Create a secure password"
                required
              />
            </label>
            <div className="form-actions">
              <button type="submit" className="button primary" disabled={loading}>
                {loading ? 'Creating account…' : 'Register'}
              </button>
              <Link to="/login" className="button outline" style={{ textDecoration: 'none' }}>
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
