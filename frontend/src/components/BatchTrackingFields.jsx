import React from 'react';
import InputField from './InputField.jsx';

const BatchTrackingFields = ({ 
  quantityReceived, 
  setQuantityReceived, 
  costPrice, 
  setCostPrice, 
  expiryDate, 
  setExpiryDate 
}) => {
  return (
    <div className="border-t border-gray-100 pt-4 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
        Batch Tracking Fields
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Units Received"
          type="number"
          placeholder="e.g. 100"
          value={quantityReceived}
          onChange={(e) => setQuantityReceived(e.target.value)}
        />
        <InputField
          label="Cost Price (Unit)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
        />
      </div>

      <InputField
        label="Batch Expiration Limit Date"
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />
    </div>
  );
};

export default BatchTrackingFields;