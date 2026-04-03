import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';
import useAuthStore from '../context/authStore';
import { Alert, LoadingSpinner } from '../components/Common';
import '../styles/authPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      setUser(response.data.user);
      setToken(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="auth-container" 
      style={{ '--bg-image': "url('/binary-bg.jpg')" }}
    >
      <div className="auth-form-wrapper">
        <div className="auth-form-card">
          <h1 className="text-3xl font-bold text-red-400 mb-8 text-center">Burpsite</h1>

          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-2 rounded transition"
            >
              {loading ? <LoadingSpinner /> : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 mb-4">Don't have an account?</p>
            <button
              onClick={() => navigate('/register')}
              className="text-red-400 hover:text-red-300 font-bold"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
