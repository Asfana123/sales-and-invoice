import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const [customers, setCustomer] = useState([]);
  const [products, setProduct] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectProducts, setSelectProducts] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [senddata, setSenddata] = useState({
    customer: null,
    tax: 0,
    discount: 0,
    invoice_products: [],
    status: "unpaid",
  });
  const token = localStorage.getItem("access_token");

  // Fetch customer data
  const fetchCustomer = () => {
    axios
      .get("http://127.0.0.1:8000/customer", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCustomer(response.data))
      .catch((error) => console.log(error.response.data));
  };

  const fetchProduct = () => {
    axios
      .get("http://127.0.0.1:8000/product", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setProduct(response.data))
      .catch((error) => console.log(error.response.data));
  };

  const total = useMemo(() => {
    const subtotal = selectProducts.reduce((sum, product) => {
      // const quantity=senddata.invoice_products.find(item=>item.id===product.id)?.quantity ||1
      return sum + parseFloat(product.price);
    }, 0);
    const discount = parseFloat(senddata.discount || 0);
    const tax = parseFloat(senddata.tax || 0);
    return subtotal - (subtotal * discount) / 100 + (subtotal * tax) / 100;
  }, [
    selectProducts,
    senddata.discount,
    senddata.tax,
    senddata.invoice_products,
  ]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      // fetchCustomer();
      // fetchProduct();
    }
  }, [token, navigate]);

  const validation = () => {
    if (!selectCustomer.id) {
      setError("Choose a customer");
      return false;
    }
    if (!selectProducts || selectProducts.length === 0) {
      setError("Products are not selected");
      return false;
    }
    return true;
  };

  const createInvoice = () => {
    if (!validation()) {
      alert("Validation failed. Please check your inputs.");
      return;
    }
    axios
      .post(`http://127.0.0.1:8000/invoice/`, senddata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setSenddata({});
        selectCustomer();
        selectProducts([]);
        navigate("/invoice");
      })
      .catch((error) => {
        console.error(error.response);
        alert("Failed to create the invoice. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold text-center mb-6">
          Invoice Creation
        </h1>
        {error && <p>{error}</p>}
        <div className="flex justify-between items-center mb-4">
          <button
            className="bg-gray-700 p-3 rounded-md text-white"
            onClick={() => {
              setModal(true);
              setModalType("customers");
              fetchCustomer();
            }}
          >
            Select Customer
          </button>

          <button
            className="bg-gray-700 m-3 text-white p-3 rounded-md"
            onClick={() => {
              setModal(true);
              setModalType("products");
              fetchProduct();
            }}
          >
            Select Product
          </button>
        </div>

        {selectCustomer.id && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Customer Details</h2>
            <div className="space-y-1">
              <h3>Name: {selectCustomer.name}</h3>
              <h3>Email: {selectCustomer.email}</h3>
              <h3>Phone: {selectCustomer.phone}</h3>
              <h3>Address: {selectCustomer.address}</h3>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <ul>
            {selectProducts.map((product, index) => (
              <li
                key={product.id}
                className="flex items-center justify-between p-4 hover:bg-gray-100 transition duration-300 rounded-md mb-2"
              >
                <span className="text-lg font-semibold text-gray-700">
                  {index + 1}
                </span>

                <span className="text-gray-800 font-medium flex-1 ml-4">
                  {product.name}
                </span>

                <label htmlFor="">qty</label>
                <input
                  type="number"
                  min="1"
                  className="border w-14 m-5"
                  onChange={(e) => {
                    quantity = parseInt(e.target.value, 10);
                    setSenddata((prev) => ({
                      ...prev,
                      invoice_products: prev.invoice_products.map((item) =>
                        item.id === product.id ? { ...item, quantity } : item
                      ),
                    }));
                  }}
                />

                <span className="text-green-600 font-semibold">
                  {product.price}
                </span>

                <button
                  className="m-5  "
                  onClick={() => {
                    setSelectProducts((prev) =>
                      prev.filter((item) => item.id != product.id)
                    );
                  }}
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <label htmlFor="tax">Tax (%)</label>
              <input
                id="tax"
                type="number"
                maxLength={2}
                min="0"
                className="p-2 border border-gray-300 rounded-md"
                value={senddata.tax}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value > 0) {
                    setSenddata({ ...senddata, tax: value });
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="discount">Discount (%)</label>
              <input
                id="discount"
                type="number"
                min="0"
                maxLength={2}
                className="p-2 border border-gray-300 rounded-md"
                value={senddata.discount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value > 0) {
                    setSenddata({ ...senddata, discount: e.target.value });
                  }
                }}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="status">status</label>
              <select
                className="p-2 border rounded-md"
                value={senddata.status}
                onChange={(e) =>
                  setSenddata({ ...senddata, status: e.target.value })
                }
              >
                <option value="Unpaid">unpaid</option>
                <option value="paid">paid </option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-right mb-6">
          <p className="font-semibold text-lg">Total: ${total.toFixed(2)}</p>
        </div>

        <div className="text-center">
          <button
            onClick={createInvoice}
            className="bg-blue-500 text-white p-3 rounded-md w-full md:w-auto"
          >
            Create Invoice
          </button>
        </div>
      </div>
      {modal && (
        <div
          className="fixed bg-gray-700 flex justify-center items-center bg-opacity-55 inset-0"
          onClick={() => setModal(false)}
        >
          <div className="bg-white w-1/2 rounded-md p-5">
            <p
              onClick={() => setModal(false)}
              className="flex justify-end cursor-pointer"
            >
              x
            </p>

            {modalType === "customers" && (
              <ul className="divide-y divide-gray-300 rounded-md shadow-md bg-white overflow-y-auto max-h-[500px]">
                <h1 className="text-center font-semibold text-xl">
                  Customer List
                </h1>
                {customers.map((cust) => (
                  <li
                    key={cust.id}
                    className="p-4 font-semibold hover:bg-blue-100 flex justify-between items-center transition-all"
                  >
                    <span>{cust.id}</span>
                    <span>{cust.name}</span>
                    <span className="text-gray-500">{cust.phone}</span>
                    <button
                      onClick={() => {
                        setSelectCustomer(cust);
                        setSenddata({ ...senddata, customer: cust.id });
                        setModal(false);
                      }}
                      className="bg-gray-600 p-2 text-white rounded-sm"
                    >
                      Select
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {modalType === "products" && (
              <div>
                <h1 className="text-2xl font-semibold text-center px-2">
                  Product List
                </h1>
                <ul className="divide-y divide-gray-300 rounded-md bg-white overflow-y-auto max-h-[500px] m-3">
                  {products.map((product) => (
                    <li
                      key={product.id}
                      className="p-4 font-semibold hover:bg-gray-200 flex justify-between items-center transition-all"
                    >
                      <span>{product.id}</span>
                      <span>{product.name}</span>
                      <span>{product.price}</span>
                      <button
                        className="bg-gray-600 text-white px-2 rounded-sm"
                        onClick={() => {
                          setSelectProducts((prev) => [...prev, product]);
                          setSenddata((prev) => ({
                            ...prev,
                            invoice_products: [
                              ...prev.invoice_products,
                              { product_id: product.id, quantity: 1 }, // Add new product
                            ],
                          }));
                        }}
                      >
                        Select
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;
