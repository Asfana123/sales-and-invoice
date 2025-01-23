import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

const Product = () => {
  document.title = "Products";
  const navigate = useNavigate();
  const [input, setInput] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    stock: "",
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("access_token");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");

  const fetchproduct = (searchTerm = "") => {
    axios
      .get(`http://127.0.0.1:8000/product/?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data);
        console.log(products)
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/");
        }
      });
  };

  const validate = () => {
    let validateerror = "";
    if (!input.name?.trim()) {
      validateerror = "Product name is required";
    } else if (!input.category?.trim()) {
      validateerror = "Category is required";
    } else if (!input.price?.trim()) {
      validateerror = "Price is required";
    } else if (isNaN(input.price) || Number(input.price) <= 0) {
      validateerror = "Price must be a positive number";
    } else if (!input.stock.trim()) {
      validateerror = "Stock is required";
    } else if (isNaN(input.stock) || Number(input.stock) <= 0) {
      validateerror = "Stock must be a positive number";
    }
    setError(validateerror);
    return !validateerror;
  };

  useEffect(() => {
    console.log('rendering')
    const timeout = setTimeout(() => {
      fetchproduct(search);
    }, 300);
    return () => clearTimeout(timeout);
  
  }, [search]);
  // else{
  //   fetchproduct()
  // }


  const handleSearch = (query) => {
    setSearch(query);
  };

  const addProduct = (e) => {
    e.preventDefault();
    if (!validate()) return;

    axios
      .post("http://127.0.0.1:8000/product/", input, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchproduct();
        setError("");
        setInput({});
        setModal(false);
      })
      .catch((error) => {
        console.log(error.response.data.non_field_errors);
        setError(error.response.data.non_field_errors);
      });
  };

  const getProduct = (id) => {
    axios
      .get(`http://127.0.0.1:8000/product/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInput(response.data), setModal(true);
      })
      .catch((error) => console.log(error.response.data));
  };

  const updateProduct = (id) => {
    axios
      .patch(`http://127.0.0.1:8000/product/${id}/`, input, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, ...response.data } : product
          )
        );
        setInput({});
        setModal(false);
      })

      .catch((error) => console.log(error.response.data));
  };

  const deleteProduct = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/product/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) =>
        setProducts((prev) => prev.filter((product) => product.id != id))
      )
      .catch((error) => console.log(error.response.data));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4"><Sidebar/></div>
   
    <div className="w-3/4 ">  
      <div className="flex justify-between m-5">
        <h1 className="text-3xl font-semibold ">Products</h1>
        <input
          type="text"
          placeholder="Search products..."
          className="w-1/4 border bg-gray-200 rounded-md mx-4 px-2 py-1"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="flex justify-center w-3/4">
          <button
            className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-md"
            onClick={() => setModal(true)}
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <table className="items-center w-3/4 ">
          <thead className="p-6 bg-gray-700 text-center text-white border ">
            <tr className="">
              <th>Id</th>
              <th>Product Name</th>
              <th>Product Category</th>
              <th>Product Price</th>
              <th>stock</th>
              <th>edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, id) => (
              <tr key={product.id} className="text-center p-2 border">
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <i
                    className="fa fa-pencil p-2"
                    onClick={() => {
                      getProduct(product.id), setModal(true);
                    }}
                  />
                  <i
                    className="fa fa-trash p-2"
                    onClick={() => deleteProduct(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-80 ">
          <div className="bg-white border rounded-md w-1/3 p-2">
            <p
              onClick={() => {
                setModal(false), setInput({}), setError("");
              }}
              className="text-xl cursor-pointer text-end px-2"
            >
              x
            </p>
            <h1 className="text-center text-2xl font-semibold">
              {input.id ? "Update Product" : "Create Product"}
            </h1>
            {error && <p className="font-semibold text-red-700"> {error} </p>}
            <form className="p-3">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-gray-200"
                name="name"
                placeholder="enter product name"
                value={input.name}
                onChange={(e) =>
                  setInput({ ...input, [e.target.name]: e.target.value })
                }
              />

              <label htmlFor="">Product Category</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-gray-200"
                name="category"
                placeholder="enter product category"
                value={input.category}
                onChange={(e) =>
                  setInput({ ...input, [e.target.name]: e.target.value })
                }
              />

              <label htmlFor="">Price</label>
              <input
                type="text"
                className="w-full border rounded-md p-2 bg-gray-200"
                name="price"
                placeholder="enter product price"
                value={input.price}
                onChange={(e) =>
                  setInput({ ...input, [e.target.name]: e.target.value })
                }
              />

              <label htmlFor="">Stock</label>
              <input
                type="text"
                className="w-full border rounded-md p-2 bg-gray-200"
                name="stock"
                placeholder="enter product stock"
                value={input.stock}
                onChange={(e) =>
                  setInput({ ...input, [e.target.name]: e.target.value })
                }
              />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  input.id ? updateProduct(input.id) : addProduct(e);
                }}
                className="w-full my-2 p-2 bg-black text-white font-semibold rounded-lg"
              >
                {input.id ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Product;
