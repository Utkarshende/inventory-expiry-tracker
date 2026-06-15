import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ShieldAlert, LayoutDashboard, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="p-1.5 bg-black text-white rounded-md">
            <ShieldAlert size={18} />
          </div>
          <h2 className="text-base font-bold tracking-tight">
            StockPulse <span className="font-light text-sm text-gray-400">| Expiry Engine</span>
          </h2>
        </div>
        
        {/* Navigation Section Buttons */}
        <div className="flex items-center gap-1 border-l border-gray-200 pl-6 space-x-1">
          <button 
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${location.pathname === '/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}
          >
            <LayoutDashboard size={13} /> Dashboard Matrix
          </button>
          <button 
            onClick={() => navigate('/inventory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${location.pathname === '/inventory' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}
          >
            <ClipboardList size={13} /> Stock Intake Desk
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-bold text-gray-900">{user?.name}</p>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{user?.role}</p>
        </div>
        <button onClick={logout} className="p-2 border border-gray-200 rounded-lg text-gray-500 transition hover:bg-gray-50 hover:text-black" title="Sign Out">
          <LogOut size={15} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
