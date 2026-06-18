// frontend/src/components/inventory/ProductCatalogFields.jsx
import React from 'react';

const ProductCatalogFields = ({ formProductId, isNewProduct, name, setName, category, setCategory, price, setPrice }) => {
  return (
    <div className={`p-4 rounded-xl border transition-all ${
      formProductId ? 'bg-gray-50/70 border-gray-200' : isNewProduct ? 'bg-amber-50/40 border-amber-200' : 'bg-gray-50/20 border-dashed border-gray-200'
    }`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
        Catalog Blueprint Fields
      </p>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">General Item Name</label>
          <input
            type="text"
            required
            disabled={formProductId !== null}
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400 outline-none focus:border-black transition"
            placeholder="e.g. Low Fat Milk 1L"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category Group</label>
            <input
              type="text"
              required
              disabled={formProductId !== null}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400 outline-none focus:border-black transition"
              placeholder="Dairy, Bakery"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Price (Selling)</label>
            <input
              type="number"
              step="0.01"
              required
              disabled={formProductId !== null}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400 outline-none focus:border-black transition"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogFields;
