import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  useEffect(()=>{

  })

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-400 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6 text-center cursor-pointer"
        onClick={()=>navigate('/dashboard')}>Invoice</h2>
        <button
          onClick={() => navigate('/customer')}
          className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
        >
          Customers
        </button>
        <button
          onClick={() => navigate('/product')}
          className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
        >
          Products
        </button>
        <button
          onClick={() => navigate('/invoice')}
          className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
        >
          Invoice
        </button>
        <button
          onClick={logout}
          className="mt-auto px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md"
        >
          Logout
        </button>
      </div>

      
    </div>
  );
};

export default Sidebar;
