// frontend/src/pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import ProductCatalogFields from '../components/inventory/ProductCatalogFields.jsx';
import BatchTrackingFields from '../components/inventory/BatchTrackingFields.jsx';
import { productAPI, batchAPI } from '../services/api.js';
import { Barcode, PlusCircle, Search } from 'lucide-react';

const Inventory = () => {
  // Catalog Form Fields
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [minStockThreshold, setMinStockThreshold] = useState('10');
  
  // Batch Form Fields
  const [quantityReceived, setQuantityReceived] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  
  // System State Parameters
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [formProductId, setFormProductId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const fetchCatalog = async () => {
    try {
      const { data } = await productAPI.getAll();
      setCatalog(data);
    } catch (err) {
      showNotice('error', 'Failed to synchronize system master catalog list.');
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const showNotice = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleBarcodeLookup = async () => {
    if (!barcode) return;
    try {
      setLoading(true);
      const { data } = await productAPI.scan(barcode);
      
      setFormProductId(data._id);
      setName(data.name);
      setCategory(data.category);
      setPrice(data.price);
      setMinStockThreshold(data.minStockThreshold);
      setIsNewProduct(false);
      showNotice('success', `Product matches: "${data.name}". Ready to log shipment batch details.`);
    } catch (err) {
      if (err.response?.status === 404) {
        setIsNewProduct(true);
        setFormProductId(null);
        setName('');
        setCategory('');
        setPrice('');
        showNotice('warning', 'Barcode not found in catalog. Enter product details to register it.');
      } else {
        showNotice('error', 'Catalog lookup connection faulted.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setBarcode('');
    setName('');
    setCategory('');
    setPrice('');
    setMinStockThreshold('10');
    setQuantityReceived('');
    setCostPrice('');
    setExpiryDate('');
    setFormProductId(null);
    setIsNewProduct(false);
  };

  const handleSubmitInventory = async (e) => {
    e.preventDefault();
    try {
      let activeProductId = formProductId;

      if (isNewProduct) {
        const productRes = await productAPI.create({
          barcode,
          name,
          category,
          price: Number(price),
          minStockThreshold: Number(minStockThreshold)
        });
        activeProductId = productRes.data._id;
      }

      if (!activeProductId) {
        return showNotice('error', 'Missing active product binding reference ID.');
      }

      await batchAPI.create({
        productId: activeProductId,
        quantityReceived: Number(quantityReceived),
        costPrice: Number(costPrice),
        expiryDate
      });

      showNotice('success', 'Inventory shipment stock logged and tracked successfully.');
      handleClearForm();
      fetchCatalog();
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Inventory transaction submission faulted.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Modular Intake Form Component */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-base border-b border-gray-100 pb-4 mb-6">
            <PlusCircle size={18} className="text-black" />
            Stock Ingestion Dashboard
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg text-xs font-semibold mb-4 border ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
              message.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
              'bg-red-50 border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmitInventory} className="space-y-4">
            {/* Barcode Scanner Element */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Product Barcode Scan ID
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 font-mono focus:bg-white outline-none focus:border-black transition"
                    placeholder="Enter Barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleBarcodeLookup}
                  disabled={loading}
                  className="px-3 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition flex items-center gap-1.5"
                >
                  <Search size={13} /> {loading ? 'Searching...' : 'Lookup'}
                </button>
              </div>
            </div>

            {/* Sub-Section A: Blueprint Mapping Fields */}
            <ProductCatalogFields 
              formProductId={formProductId}
              isNewProduct={isNewProduct}
              name={name}
              setName={setName}
              category={category}
              setCategory={setCategory}
              price={price}
              setPrice={setPrice}
            />

            {/* Sub-Section B: Financial and Shipping Tracking Details */}
            <BatchTrackingFields 
              quantityReceived={quantityReceived}
              setQuantityReceived={setQuantityReceived}
              costPrice={costPrice}
              setCostPrice={setCostPrice}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
            />

            <button
              type="submit"
              className="w-full bg-black text-white text-sm font-bold py-2.5 px-4 rounded-lg hover:bg-gray-800 transition shadow-sm mt-2"
            >
              Commit Data to Registry
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN Placeholder (e.g. for listing/metrics tables) */}
        <div className="lg:col-span-7">
          {/* Render your data catalog elements or summary charts here */}
        </div>

      </div>
    </div>
  );
};

export default Inventory;