// frontend/src/pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import ProductCatalogFields from '../components/inventory/ProductCatalogFields.jsx';
import BatchTrackingFields from '../components/inventory/BatchTrackingFields.jsx';
import CameraScannerModal from '../components/modals/CameraScannerModal.jsx';
import { productAPI, batchAPI } from '../services/api.js';
import { Barcode, PlusCircle, Search, Package, Camera } from 'lucide-react';

const Inventory = () => {
  // Catalog Form Layout Fields
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [minStockThreshold] = useState('10');
  
  // Batch Tracking Specific Fields
  const [quantityReceived, setQuantityReceived] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  
  // App Mechanics States
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [formProductId, setFormProductId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  // Camera Modal View Layer State Variable Toggle
  const [isScannerOpen, setIsScannerOpen] = useState(false);

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

  // Helper listener that catches scanned payload outputs from our hardware wrapper modal
  const handleCameraScanSuccess = (scannedBarcode) => {
    setBarcode(scannedBarcode);
    showNotice('success', `Barcode frame captured: ${scannedBarcode}. Fetching details...`);
  };

  const handleBarcodeLookup = async () => {
    const activeCode = barcode;
    if (!activeCode) return;
    try {
      setLoading(true);
      const { data } = await productAPI.scan(activeCode);
      
      setFormProductId(data._id);
      setName(data.name);
      setCategory(data.category);
      setPrice(data.price);
      setIsNewProduct(false);
      showNotice('success', `Product matches: "${data.name}". Ready to log shipment details.`);
    } catch (err) {
      if (err.response?.status === 404) {
        setIsNewProduct(true);
        setFormProductId(null);
        setName('');
        setCategory('');
        setPrice('');
        showNotice('warning', 'Barcode not found in catalog. Enter item properties below to create profile.');
      } else {
        showNotice('error', 'Catalog database look-up faulted.');
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
        return showNotice('error', 'Missing unique database product relation reference ID.');
      }

      await batchAPI.create({
        productId: activeProductId,
        quantityReceived: Number(quantityReceived),
        costPrice: Number(costPrice),
        expiryDate
      });

      showNotice('success', 'Stock entry successfully logged in inventory database.');
      handleClearForm();
      fetchCatalog();
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Inventory submission request transaction faulted.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input Form Desk */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
              <PlusCircle size={18} className="text-black" />
              Stock Ingestion Desk
            </div>
            {/* Added Camera Trigger Button Control */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition text-gray-700 bg-white"
            >
              <Camera size={13} /> Camera Intake
            </button>
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
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Product Barcode ID</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 font-mono focus:bg-white outline-none focus:border-black transition"
                    placeholder="Enter Barcode String"
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
                  <Search size={13} /> {loading ? 'Checking...' : 'Lookup'}
                </button>
              </div>
            </div>

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

            <BatchTrackingFields 
              quantityReceived={quantityReceived}
              setQuantityReceived={setQuantityReceived}
              costPrice={costPrice}
              setCostPrice={setCostPrice}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClearForm}
                className="w-1/3 py-2 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 transition"
              >
                Clear
              </button>
              <button
                type="submit"
                className="w-2/3 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition"
              >
                Save Stock Entry
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Master Listing Visualizer */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-base border-b border-gray-100 pb-4 mb-4">
            <Package size={18} className="text-black" />
            Master Store Catalog System ({catalog.length})
          </div>

          {catalog.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No active items registered in store catalog database.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Barcode ID</th>
                    <th className="px-4 py-3 text-right">MSRP Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {catalog.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3 font-semibold text-gray-900">{item.name}</td>
                      <td className="px-4 py-3">
{item.category}</td>
                      <td className="px-4 py-3 font-mono">{item.barcode}</td>
                      <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>    
                </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Camera Scanner Modal Layer */}
      {isScannerOpen && (
        <CameraScannerModal 
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleCameraScanSuccess}
        />
      )}
    </div>
  );
}

export default Inventory;