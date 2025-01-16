import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        console.log(response.data);
      })
      .catch((error) => console.log(error.response.data));
  };



  useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <div className="min-h-screen p-8 ">
      <h1 className="text-3xl flex jus font-semibold">Invoices</h1>
      <button
        className=" border border-lg rounded-md p-2 bg-black text-white mr-10"
        onClick={() => navigate("/create invoice")}
      >
        create invoice
      </button>
      <div className="flex justify-center m-5">
        <table className="items-center w-3/4 ">
          <thead className="p-6 bg-gray-700 text-center text-white border ">
            <tr className="">
              <th>Invoice Id</th>
              <th>customer name</th>
              <th>Issue Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="p-2 ">
            {invoices.map((invoice, id) => (
              <tr key={invoice.id} className="text-center text-md border">
                <td className="">#invoice{invoice.id}</td>
                <td className="">{invoice.customer.name}</td>
                <td>{invoice.created_at}</td>
                <td>{invoice.payment_status}</td>

                <td>
                  <button className="text-black p-2">
                    <i
                      className="fa fa-pencil"
                      aria-hidden="true"
                      // onClick={}
                    ></i>
                  </button>
                  <i
                    className="fa fa-trash text-black p-2 ml-2 aria-hidden"
                    // onClick={}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Invoice;
