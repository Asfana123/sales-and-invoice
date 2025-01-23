import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'

const ViewInvoice = () => {
  const [customer, setCustomer] = useState({});
  const [products, setProducts] = useState([]);
  const [invoice, setInvoice] = useState({});
  const { id } = useParams();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/invoice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data;
        setCustomer(data.invoice.customer);
        const productDetails = data.products.map((item) => ({
          ...item.product,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }));
        setProducts(productDetails);
        setInvoice(data.invoice);
      })
      .catch((error) => console.log(error.response));
  }, [id, token]);

  const downloadInvoice = () => {
    const element = document.getElementById('invoice');
    html2canvas(element, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice_${invoice.id}.pdf`);
      })
      .catch((error) => console.error('Error generating PDF:', error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg" id='invoice'>
        <h1 className="text-xl font-semibold text-center mb-6">Invoice</h1>

        <div className="flex justify-between">
          {customer && customer.id && (
            <div className="mb-6">
              <h3 className="text-md font-semibold">Customer Details</h3>
              <p>Name: {customer.name}</p>
              <p>Email: {customer.email}</p>
              <p>Phone: {customer.phone}</p>
              <p>Address: {customer.address}</p>
            </div>
          )}

          <div>
            <h3 className='font-semibold'> ID: #Invoice 00{invoice.id}</h3>
            <h3 className='font-semibold'>Date: {invoice.created_at}</h3>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <ul>
            {products && products.length > 0 ? (
              products.map((product, index) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between  hover:bg-gray-100 transition duration-300 rounded-md mb-2"
                >
                  <span className="text-lg font-semibold text-gray-700">{index + 1}</span>
                  <span className="text-gray-800 font-medium flex ml-4">{product.name}</span>
                  <span className="text-gray-600 p-8">Qty: {product.quantity}</span>
                  <span className="text-green-600 font-semibold">₹{product.subtotal}</span>
                </li>
              ))
            ) : (
              <p>No products found for this invoice.</p>
            )}
          </ul>
        </div>
        <div className='flex justify-between'>
          <h2 className='text-lg'>status : {invoice.payment_status}</h2>
        <div className="text-right mb-6">
          <p >Tax : ₹{invoice.tax}</p>
          <p>Discount : ₹{invoice.discount} </p>
          <p className="font-semibold text-lg">Total: ₹{invoice.total_amount}</p>
        </div>
        </div>
        <div className="text-center mt-6">
        <button
          onClick={downloadInvoice}
          className="bg-blue-500 text-white p-3 rounded-md"
        >
          Download Invoice
        </button>
      </div>
      </div>
      
    </div>
  );
};

export default ViewInvoice;
