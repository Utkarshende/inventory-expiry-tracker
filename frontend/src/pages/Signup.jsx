// frontend/src/pages/Signup.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { ShieldAlert } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) return setError('All fields are required.');

    try {
      setLoading(true);
      const { data } = await authAPI.signup({ name, email, password, role });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-black text-white rounded-lg mb-3">
            <ShieldAlert size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Register an automated stock management profile</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none transition focus:border-black"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none transition focus:border-black"
              placeholder="manager@store.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none transition focus:border-black"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1.5">System Role Assignment</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none transition focus:border-black"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="staff">Floor Staff Member</option>
              <option value="manager">Store Manager Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium transition hover:bg-gray-800 disabled:bg-gray-400">
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-black hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
