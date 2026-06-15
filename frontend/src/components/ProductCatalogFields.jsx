import React from 'react';
import InputField from './InputField.jsx';

const ProductCatalogFields = ({ 
  formProductId, 
  isNewProduct, 
  name, 
  setName, 
  category, 
  setCategory, 
  price, 
  setPrice 
}) => {
  const isReadOnly = formProductId !== null;

  return (
    <div className={`p-4 rounded-xl border transition-colors ${
      isReadOnly ? 'bg-gray-50/50 border-gray-200' : 
      isNewProduct ? 'bg-amber-50/30 border-amber-200' : 
      'bg-gray-50/20 border-dashed border-gray-200'
    }`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
        Catalog Blueprint Fields
      </p>
      
      <div className="space-y-3">
        <InputField
          label="General Item Name"
          placeholder="e.g. Low Fat Milk 1L"
          disabled={isReadOnly}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Category Group"
            placeholder="Dairy, Bakery"
            disabled={isReadOnly}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <InputField
            label="Price (Selling)"
            type="number"
            step="0.01"
            placeholder="0.00"
            disabled={isReadOnly}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogFields;