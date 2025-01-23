import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CreateInvoice = () => {
  const { id } = useParams();
  const [customers, setCustomer] = useState([]);
  const [products, setProduct] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectProducts, setSelectProducts] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const token = localStorage.getItem("access_token");


  const [senddata, setSenddata]=useState({
    customer: null,
    tax: 0,
    discount: 0,
    products: [],
    status: "unpaid",
  });

  const createInvoice = () => {
    if (!validation()) {
      alert("Validation failed. Please check your inputs.");
      return;
    }
    axios
      .post("http://127.0.0.1:8000/invoice/", senddata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(selectProducts)
        console.log(senddata);
        setSelectCustomer({});
        console.log(senddata['products'])
        setSelectProducts([]);
        navigate("/invoice");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/");
        }
      });
  };


  const updateInvoice = (id) => {
    if (!validation()) return;
    console.log(senddata);
    axios
      .patch(`http://127.0.0.1:8000/invoice/${id}`, senddata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        
        navigate("/invoice");
      })
      .catch((error) => console.error(error.response.data));
  };


  const handleProduct = (product) => {
    if (product.stock === 0) {
      setError("Product is out of stock");
      return;
    }
    const existingProduct = selectProducts.find((p) => p.id === product.id);
    if (existingProduct){
      setSelectProducts((prev)=>prev.map((p)=>
        p.id==product.id ? {...p, quantity: p.quantity+1} : p ))
     
      setSenddata((prev) => ({
        ...prev,
        products: prev.products.map((p)=>
        p.product_id===product.id ?
      {...p, quantity:p.quantity+1}:p)
      }));
    }
    else {
      // If the product doesn't exist, add it with quantity 1
      setSelectProducts((prev) => [...prev, { ...product, quantity: 1 }]);
      setSenddata((prev)=>({
        ...prev, products:[...prev.products, {product_id:product.id, quantity:1}]
      }))
    }
  }
  
  const fetch_data = (id) => {
    if (!id) {
      console.error("Invalid invoice ID");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/invoice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data)
        const invoice = response.data.invoice;
        const fetchedProducts = response.data.products.map((item) => ({
          ...item.product,
          quantity: item.quantity, 
        }));
        console.log()
        setSelectCustomer(invoice.customer || {});
        setSelectProducts(fetchedProducts);
        
          setSenddata({
            customer: selectCustomer.id || null,
            tax: 0,
            discount: 0,
            products: selectProducts.map((product) => ({
              product_id: product.id,
              quantity: 1,
            })),
            status: "unpaid",
          });
        })
        
      .catch((error) => {
        console.error("Error fetching data:", error.response);
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/");
        }
      });
  };

  
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
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/");
        }
      });
  };

  // Calculate total amount
  const totalamount = useMemo(() => {
    const subtotal = selectProducts.reduce(
      (sum, product) => sum + parseFloat(product.price)*product.quantity,
      0
    );

    const tax = (subtotal * senddata.tax) / 100;
    const discount = (subtotal * senddata.discount) / 100;
    return subtotal + tax - discount ;
  }, [selectProducts, senddata.tax, senddata.discount]);

  useEffect(() => setTotal(totalamount), [totalamount]);


  useEffect(() => {
    if (!token) {
      navigate("/");
    } else if (id) {
      fetch_data(id);
    }
    console.log(selectProducts)
  }, [token, id]);

  
  const validation = () => {
    if (!selectCustomer.id) {
      setError("Choose a customer");
      return false;
    }
    if (selectProducts.length === 0) {
      setError("Products are not selected");
      return false;
    }
    return true;
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold text-center mb-6">
         {id? 'update invoice' : 'invoice Creation'}
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

        {selectCustomer&& selectCustomer.id && (
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
    {selectProducts && selectProducts.length > 0 ? (
      selectProducts.map((product, index) => {
        // Find the product in senddata.products to get its quantity
        const qty = senddata.products.find((pro) => pro.product_id === product.id);

        return (
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

            <span className="text-gray-800 font-medium flex-1 ml-4">
              {product && product.quantity } 
            </span>

            <span className="text-green-600 font-semibold">
              {product.price}
            </span>
          {id ? <></>:
            <button
              className="m-5"
              onClick={() => {
                setSelectProducts((prev) =>
                  prev.filter((item) => item.id !== product.id)
                );
                setSenddata((prev) => ({
                  ...prev,
                  products: prev.products.filter((p) => p.product_id !== product.id),
                }));
              }}>
              remove
            </button>
          }
          </li>
        );
      })
    ):<p>no product choose</p>}
  </ul>
</div>


        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <label htmlFor="tax">Tax (%)</label>
              <input
                id="tax"
                type="text"
                maxLength={2}
                className="p-2 border border-gray-300 rounded-md"
                value= {senddata.tax||0}
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
                type="text"
                maxLength={2}
                className="p-2 border border-gray-300 rounded-md"
                value={senddata.discount || 0}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value > 0) {
                    setSenddata({ ...senddata, discount: value });
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
          <p className="font-semibold text-lg">Total: {Number(total).toFixed(2)}</p>
        </div>

        <div className="text-center">{id ?(
          <button
            onClick={()=>updateInvoice(id)}
            className="bg-blue-500 text-white p-3 rounded-md w-full md:w-auto"
          >
            update Invoice
          </button>):(
            <button
            onClick={createInvoice}
            className="bg-blue-500 text-white p-3 rounded-md w-full md:w-auto"
          >
            Create Invoice
          </button>
          )}
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
                      <span>{product.stock}</span>
                      <button
                        className="bg-gray-600 text-white px-2 rounded-sm"
                        onClick={() => {
                          handleProduct(product)  
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
