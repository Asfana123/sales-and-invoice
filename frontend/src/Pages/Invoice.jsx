import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

const Invoice = () => {
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);

  const fetchInvoice = () => {
    if (!token) {
      navigate("/");
    }
    axios
      .get("http://127.0.0.1:8000/invoice", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInvoices(response.data);
      })
      .catch((error) => console.log(error.response.data));
  };

  const update_paymentstatus = (id, status) => {
    axios
      .patch(
        `http://127.0.0.1:8000/invoice/${id}`,
        { payment_status: status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setInvoices((prev) =>
          prev.map((invoice) =>
            invoice.id === id
              ? { ...invoice, payment_status: status }
              : invoice
          )
        );
      })
      .catch((error) => console.log(error.response));
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  const getinvoice=(id)=>{
    navigate(`/view_invoice/${id}`)
    
  }


  const handleUpdate = (id) => navigate(`/create_invoice/${id}`);



  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/invoice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
      })
      .catch((error) => console.log(error.response));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className=" w-1/4 bg-white">
        <Sidebar />
      </div>
      <div className="w-3/4 min-h-screen p-5 overflow-auto">
        <h1 className="text-3xl font-semibold mb-6">Invoices</h1>
        <button
          className="border border-lg rounded-md p-2 bg-gray-700 text-white mb-6"
          onClick={() => navigate("/create_invoice")}
        >
          Create Invoice
        </button>
        <div className="overflow-auto bg-white rounded-lg shadow-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-2">Invoice Id</th>
                <th className="px-4 py-2">Customer Name</th>
                <th className="px-4 py-2">Issue Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices && invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="text-center border-b hover:bg-gray-100"
                  >
                    <td className="px-4 py-2">#invoice{invoice.id}</td>
                    <td className="px-4 py-2">{invoice.customer.name}</td>
                    <td className="px-4 py-2">{invoice.created_at}</td>
                    <td className="px-4 py-2">
                      {invoice.payment_status === "unpaid" ? (
                        <select
                          name="payment_status"
                          value={invoice.payment_status}
                          onChange={(e) =>
                            update_paymentstatus(invoice.id, e.target.value)
                          }
                          className="border rounded-md p-1"
                        >
                          <option value="paid">Paid</option>
                          <option value="unpaid">Unpaid</option>
                        </select>
                      ) : (
                        <span>{invoice.payment_status}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex justify-center">
                      <button
                        className="text-black p-2"
                        onClick={() => handleUpdate(invoice.id)}
                      >
                        <i className="fa fa-pencil" aria-hidden="true" />
                      </button>
                      <button
                        className="text-black p-2 ml-2"
                        onClick={() => handleDelete(invoice.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true" />
                      </button>

                      <button onClick={()=>getinvoice(invoice.id)}>view</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No invoices available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
