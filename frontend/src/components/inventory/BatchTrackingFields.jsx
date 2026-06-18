// frontend/src/components/inventory/BatchTrackingFields.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

const BatchTrackingFields = ({ quantityReceived, setQuantityReceived, costPrice, setCostPrice, expiryDate, setExpiryDate }) => {
  return (
    <div className="border-t border-gray-100 pt-4 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
        Batch Tracking Fields
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Units Received</label>
          <input
            type="number"
            required
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition"
            placeholder="e.g. 100"
            value={quantityReceived}
            onChange={(e) => setQuantityReceived(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Cost Price (Each)</label>
          <input
            type="number"
            step="0.01"
            required
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition"
            placeholder="0.00"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Batch Expiry Date</label>
        <div className="relative">
          <Calendar size={15} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
          <input
            type="date"
            required
            className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BatchTrackingFields;
