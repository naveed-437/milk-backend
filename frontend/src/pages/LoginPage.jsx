import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setToast({ type: 'error', message: 'Email and password are required.' });
      return;
    }

    try {
      setLoading(true);
      const response = await login({ email, password });
      setToast({ type: 'success', message: response.message || 'Login successful.' });
      navigate('/profile');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed.';
      setToast({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
      window.setTimeout(() => setToast(null), 3600);
    }
  };

  return (
    <div className="app-shell auth-shell">
      <div className="page-grid auth-grid">
        <div className="form-card auth-card">
          <div className="panel-title-row">
            <div>
              <h2>Login to ASN Dairy Hub</h2>
              <span>Enter your credentials to access the dashboard.</span>
            </div>
          </div>

          {toast && (
            <div className={`status ${toast.type === 'error' ? 'error' : 'success'}`}>
              {toast.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="crud-form">
            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="button primary" disabled={loading}>
                {loading ? 'Signing in…' : 'Login'}
              </button>
              <Link to="/register" className="button outline" style={{ textDecoration: 'none' }}>
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
