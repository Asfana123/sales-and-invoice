import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Dashboard = () => {
  document.title = 'Dashboard';

  const navigate = useNavigate();

  // State to hold API data
  const [outstanding, setOutstanding] = useState(0);
  const [sales, setSales] = useState(0);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [count, setCount]=useState(0)

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      navigate('/');
    } else {
      axios
        .get('http://127.0.0.1:8000/dashboard/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('API Response:', response.data); // Check the structure of the response
          setOutstanding(response.data.outstanding);
          setSales(response.data.total_sales);
          setRecentInvoices(response.data.recent_Invoice);
          console.log(outstanding)
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            navigate('/');
          }
        });
    }
  }, [navigate]);



  

  return (
    
       <div className="flex min-h-screen bg-gray-100">
    
      <div className=" bg-white shadow-lg">
        <Sidebar />
      </div>
       <div className="w-3/4 p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
         
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Total Sales</h2>
            <p className="text-2xl font-bold text-blue-500">${sales}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Outstanding Payments</h2>
            <p className="text-2xl font-bold text-red-500">${outstanding}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Recent Invoices</h2>
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-200">Invoice ID</th>
                <th className="px-4 py-2 bg-gray-200">Customer</th>
                <th className="px-4 py-2 bg-gray-200">Total Amount</th>
                <th className="px-4 py-2 bg-gray-200">Status</th>
                <th className="px-4 py-2 bg-gray-200">Created At</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{invoice.id}</td>
                  <td className="px-4 py-2">{invoice.customer.name}</td>
                  <td className="px-4 py-2">${invoice.total_amount}</td>
                  <td className="px-4 py-2">{invoice.payment_status}</td>
                  <td className="px-4 py-2">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
