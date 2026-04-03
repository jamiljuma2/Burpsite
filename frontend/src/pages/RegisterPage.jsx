import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';
import useAuthStore from '../context/authStore';
import { Alert, LoadingSpinner } from '../components/Common';
import '../styles/authPages.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password,
        confirmPassword,
      });
      setUser(response.data.user);
      setToken(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
          <h1 className="text-3xl font-bold text-red-400 mb-8 text-center">Create Account</h1>

          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                placeholder="Your username"
              />
            </div>

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

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-2 rounded transition"
            >
              {loading ? <LoadingSpinner /> : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 mb-4">Already have an account?</p>
            <button
              onClick={() => navigate('/login')}
              className="text-red-400 hover:text-red-300 font-bold"
            >
              Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
