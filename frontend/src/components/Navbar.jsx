// frontend/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { LogOut, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-black text-white rounded-md">
          <ShieldAlert size={18} />
        </div>
        <h2 className="text-base font-bold tracking-tight">
          StockPulse <span className="font-light text-sm text-gray-400">| Expiry Engine</span>
        </h2>
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
