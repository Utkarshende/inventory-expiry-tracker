// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar.jsx';
import AiInsightsModal from '../components/modals/AiInsightsModal.jsx';
import { batchAPI, productAPI } from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { AlertCircle, AlertTriangle, CheckCircle2, Sparkles, Layers } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [matrix, setMatrix] = useState({ critical: [], warning: [], safe: [] });
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // AI Modal States
  const [selectedAiBatch, setSelectedAiBatch] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [matrixRes, catalogRes] = await Promise.all([
        batchAPI.getDashboard(),
        productAPI.getAll()
      ]);
      
      setMatrix(matrixRes.data);
      const alerts = catalogRes.data.filter(item => (item.currentStock ?? 4) <= (item.minStockThreshold ?? 10));
      setLowStockAlerts(alerts);
    } catch (err) {
      setError('Could not establish synchronization connection with inventory storage engines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenAiEngine = (batch) => {
    setSelectedAiBatch(batch);
    setIsAiModalOpen(true);
  };

  const handleExecuteAiDiscount = async (batchId) => {
    try {
      await batchAPI.applyDiscount(batchId);
      setIsAiModalOpen(false);
      fetchDashboardData(); // Hot reload UI metrics layout
    } catch (err) {
      alert(err.response?.data?.message || 'AI Discount validation faulted.');
    }
  };

  if (loading) return <div className="p-12 text-center text-sm text-gray-500 font-medium tracking-wide">Loading Inventory Health Matrix Engine...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl shadow-sm">
            {error}
          </div>
        )}

        {/* Analytics Expiry Summary Row */}
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

        {/* MAIN SPLIT GRID CORES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Clearance Desk containing our new integrated AI Triggers */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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
                      <th className="px-5 py-3">Product Name</th>
                      <th className="px-5 py-3">Barcode ID</th>
                      <th className="px-5 py-3">Expiration Date</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-600">
                    {matrix.critical.map((batch) => (
                      <tr key={batch._id} className="hover:bg-gray-50/40 transition">
                        <td className="px-5 py-4 font-semibold text-gray-900">{batch.productId?.name}</td>
                        <td className="px-5 py-4 font-mono text-xs text-gray-400">{batch.productId?.barcode}</td>
                        <td className="px-5 py-4 font-bold text-red-600">
                          {new Date(batch.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {batch.status === 'discounted' ? (
                            <span className="px-2 py-1 bg-sky-50 text-sky-700 text-[10px] font-bold uppercase rounded border border-sky-100">Discounted</span>
                          ) : (
                            user?.role === 'manager' && (
                              <button 
                                onClick={() => handleOpenAiEngine(batch)} 
                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 border border-indigo-200 bg-indigo-50 px-2.5 py-1 rounded-md shadow-sm hover:bg-indigo-100 transition"
                              >
                                <Sparkles size={12} className="fill-indigo-200" /> AI Strategy
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* RIGHT: Depleted Stock Warning Hub */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-amber-50/50 border-b border-gray-200 flex items-center gap-2 text-amber-800 font-bold text-sm tracking-wide">
              <Layers size={16} /> Depleted Stock Alert Hub
            </div>

            <div className="p-4 divide-y divide-gray-100">
              {lowStockAlerts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">All product catalog items fulfill active base capacity thresholds.</p>
              ) : (
                lowStockAlerts.map(product => (
                  <div key={product._id} className="py-3 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">Barcode: {product.barcode}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded font-bold text-[10px]">
                        {product.currentStock ?? 3} / {product.minStockThreshold ?? 10} Left
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Render Gate for mounting the AI Analysis Engine Layer */}
      <AiInsightsModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        batch={selectedAiBatch}
        onApplyAiDiscount={handleExecuteAiDiscount}
      />
    </div>
  );
};

export default Dashboard;
