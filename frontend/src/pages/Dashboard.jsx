// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar.jsx';
import { batchAPI } from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { AlertCircle, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [matrix, setMatrix] = useState({ critical: [], warning: [], safe: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await batchAPI.getDashboard();
      setMatrix(data);
    } catch (err) {
      setError('Could not establish synchronization connection with inventory storage engines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApplyDiscount = async (batchId) => {
    if (user?.role !== 'manager') return;
    try {
      await batchAPI.applyDiscount(batchId);
      fetchDashboardData(); // Hot refresh dashboard view layouts
    } catch (err) {
      alert(err.response?.data?.message || 'Discount processing request faulted.');
    }
  };

  if (loading) return <div className="p-12 text-center text-sm text-gray-500 font-medium tracking-wide">Loading Inventory Health Matrix Engine...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl shadow-sm">
            {error}
          </div>
        )}

        {/* Analytics Expiry Summary Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-l-4 border-red-500 border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Critical Expirations (&lt;7 Days)</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{matrix.critical.length}</p>
            </div>
            <div className="p-2 bg-red-50 text-red-500 rounded-lg"><AlertCircle size={20} /></div>
          </div>

          <div className="bg-white border-l-4 border-amber-500 border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Warning Parameters (7-30 Days)</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{matrix.warning.length}</p>
            </div>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><AlertTriangle size={20} /></div>
          </div>

          <div className="bg-white border-l-4 border-emerald-500 border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Stable Stock Elements</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{matrix.safe.length}</p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><CheckCircle2 size={20} /></div>
          </div>
        </div>

        {/* Priority Action Execution Clearance Desk */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-red-50/50 border-b border-gray-200 flex items-center gap-2 text-red-700 font-bold text-sm tracking-wide">
            <AlertCircle size={16} /> High-Urgency Expiration Clearance Desk
          </div>
          
          {matrix.critical.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-400">All clear! No current inventory units flagged for critical expiration thresholds.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">Barcode ID</th>
                    <th className="px-6 py-3">Expiration Timeline</th>
                    <th className="px-6 py-3">Quantity Left</th>
                    <th className="px-6 py-3">Urgency State</th>
                    {user?.role === 'manager' && <th className="px-6 py-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {matrix.critical.map((batch) => (
                    <tr key={batch._id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">{batch.productId?.name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{batch.productId?.barcode}</td>
                      <td className="px-6 py-4 font-bold text-red-600">
                        {new Date(batch.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{batch.quantityRemaining} Units</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          batch.status === 'discounted' ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {batch.status === 'discounted' ? 'Discount Running' : 'Critical Threat'}
                        </span>
                      </td>
                      {user?.role === 'manager' && (
                        <td className="px-6 py-4 text-right">
                          {batch.status !== 'discounted' && (
                            <button onClick={() => handleApplyDiscount(batch._id)} className="inline-flex items-center gap-1.5 text-xs font-bold text-black border border-gray-200 bg-white shadow-sm px-3 py-1.5 rounded-lg transition hover:bg-gray-50">
                              <TrendingDown size={13} /> Flash Markdown
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
