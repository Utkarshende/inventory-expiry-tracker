// frontend/src/components/modals/AiInsightsModal.jsx
import React from 'react';
import { X, Sparkles, TrendingDown, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { analyzeInventoryHealthAI } from '../../services/aiEngine.js';

const AiInsightsModal = ({ isOpen, onClose, batch, onApplyAiDiscount }) => {
  if (!isOpen || !batch) return null;

  // Run the batch metadata parameters through our prediction engine
  const aiReport = analyzeInventoryHealthAI(batch);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modern Modal Banner Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-900 text-white">
          <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
            <Sparkles size={16} className="text-amber-400 fill-amber-400" />
            StockPulse AI Assistant
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition">
            <X size={16} />
          </button>
        </div>

        {/* Predictive Metrics Matrix Content View */}
        <div className="p-6 space-y-5">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Threat Asset</span>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">{batch.productId?.name}</h3>
            <p className="text-xs font-mono text-gray-500 mt-0.5">Barcode reference sequence: {batch.productId?.barcode}</p>
          </div>

          {/* Core Analytics Grid Column Row split */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">AI Waste Risk</span>
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1.5 ${
                aiReport.wasteRisk === 'Critical' || aiReport.wasteRisk === 'High' 
                  ? 'bg-red-50 text-red-700 border border-red-100' 
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                {aiReport.wasteRisk} Status
              </span>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Timeline Matrix</span>
              <span className="text-sm font-bold text-gray-900 block mt-1">{aiReport.daysRemaining} Days Left</span>
            </div>
          </div>

          {/* AI Strategy Generation Panel Box Card */}
          <div className="bg-gradient-to-br from-amber-50/40 to-orange-50/20 border border-amber-200/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <TrendingDown size={14} /> Recommended Price Drop Action
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">-{aiReport.markdownPercent}%</span>
              <span className="text-xs font-medium text-gray-500">Suggested Smart Markdown</span>
            </div>

            <div className="text-xs text-gray-700 bg-white/70 border border-amber-100 rounded-lg p-2.5 leading-relaxed">
              <strong className="block text-gray-900 font-bold mb-0.5">Merchandising Action:</strong>
              {aiReport.alternativeAction}
            </div>
          </div>
        </div>

        {/* Modal Foot Actions Layout Strip */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-2 border border-gray-200 bg-white rounded-lg text-xs font-semibold hover:bg-gray-100 transition"
          >
            Dismiss
          </button>
          
          <button
            type="button"
            onClick={() => onApplyAiDiscount(batch._id)}
            className="w-2/3 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            Accept AI Strategy <ArrowUpRight size={13} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AiInsightsModal;
