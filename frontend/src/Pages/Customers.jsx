import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

const Customers = () => {
  document.title = "Customers";

  const navigate = useNavigate();
  const [customers, setCustomer] = useState([]);
  const [input, setInput] = useState({
    name: "",
    id: null,
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const token = localStorage.getItem("access_token");
  const [modal, setModal] = useState(false);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const fetchcustomer = () => {
    axios
      .get("http://127.0.0.1:8000/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setCustomer(response.data);
        console.log(customers);
      })

      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("accss_token");
          navigate("/");
        }
      });
  };

  const handleApiError = (error) => {
    if (error.response && error.response.data) {
      setError(error.response.data.email || "An error occurred");
    } else {
      setError("");
    }
  };

  const validation = () => {
    if (!input.name || !input.email || !input.phone || !input.address) {
      setError("Every field should be required");
      return false;
    } else {
      setError("");
      return true;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log(token);
    if (!token) {
      navigate("/");
    } else {
      fetchcustomer();
    }
  }, [navigate]);

  const addCustomer = () => {
    if (!validation()) {
      return;
    }
    if (!validatePhoneNumber(input.phone)) {
      setError("Enter a valid phone number");
      return;
    }
    axios
      .post("http://127.0.0.1:8000/customer/", input, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModal(false);
        setInput({});
        console.log(input);
        setError("");
        fetchcustomer();
      })
      .catch((error) => {
        handleApiError(error);
      });
  };

  const getCustomer = (id) => {
    console.log(input);
    console.log(id);
    axios
      .get(`http://127.0.0.1:8000/customer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setModal(true);
        setInput(response.data);
      })
      .catch((error) => handleApiError(error));
  };

  const updatecustomer = (id) => {
    if (!validatePhoneNumber(input.phone)) {
      setError("Enter a valid phone number");
      return;
    }
    axios
      .patch(`http://127.0.0.1:8000/customer/${id}/`, input, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setModal(false);
        setCustomer((prevCus) =>
          prevCus.map((cust) =>
            cust.id === id ? { ...cust, ...response.data } : cust
          )
        );
        setInput();
      })
      .catch((error) => handleApiError(error));
  };

  const deleteCustomer = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/customer/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setCustomer((prev) => prev.filter((customer) => customer.id != id));
      })
      .catch((error) => handleApiError(error));
  };

  return (
    <div className="min-h-screen p-8 ">
      <h1 className="text-3xl flex jus font-semibold">Customers</h1>
      <button
        className=" border border-lg rounded-md p-2 bg-black text-white mr-10"
        onClick={() => setModal(true)}
      >
        add Customer
      </button>
      {customers.length > 0 ? (
        <div className="flex justify-center m-5">
          <table className="items-center w-3/4 ">
            <thead className="p-6 bg-gray-700 text-center text-white border ">
              <tr className="">
                <th>Id</th>
                <th>Name</th>
                <th>email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>edit</th>
              </tr>
            </thead>
            <tbody className="p-2 ">
              {customers.map((cust, id) => (
                <tr key={cust.id} className="text-center text-md border">
                  <td className="">{cust.id}</td>
                  <td className="">{cust.name}</td>
                  <td>{cust.email}</td>
                  <td>{cust.phone}</td>
                  <td className="break-words max-w-[200px] p-2">
                    {cust.address}
                  </td>
                  <td>
                    <button className="text-black p-2">
                      <i
                        className="fa fa-pencil"
                        aria-hidden="true"
                        onClick={() => getCustomer(cust.id)}
                      ></i>
                    </button>
                    <i
                      className="fa fa-trash text-black p-2 ml-2 aria-hidden"
                      onClick={() => deleteCustomer(cust.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No customers available.</p>
      )}

      {modal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-80  flex justify-center items-center p-7">
          <div className="bg-white p-4 rounded-md w-1/3">
            <button
              className="p-2"
              onClick={() => {
                setModal(false);
                setError("");
                setInput({});
              }}
            >
              x
            </button>
            <h2 className="text-center font-medium text-xl">
              {input.id ? "Update Customer" : "Create Customer"}
            </h2>
            {error && <p> {error}</p>}
            <form>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="enter customer name"
                name="name"
                value={input.name}
                onChange={(e) =>
                  setInput({ ...input, [e.target.name]: e.target.value })
                }
                className="p-2 w-full border border-lg rounded-md"
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                disabled={input.id ? true : false}
                placeholder="enter customer email"
                value={input.email}
                onChange={(e) =>
                  setInput({
                    ...input,
                    [e.target.name]: e.target.value,
                  })
                }
                className="p-2 w-full border border-lg rounded-md"
              />

              <label htmlFor="email">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={input.phone}
                placeholder="enter customer Phone Number"
                maxLength="10"
                onChange={(e) =>
                  setInput({
                    ...input,
                    [e.target.name]: e.target.value,
                  })
                }
                className="p-2 w-full border border-lg rounded-md"
              />

              <label htmlFor="email">address</label>
              <textarea
                id="address"
                placeholder="Enter customer address"
                name="address"
                value={input.address}
                onChange={(e) =>
                  setInput({ ...input, [e.target.name]: e.target.value })
                }
                className="p-2 w-full border border-gray-300 rounded-md"
              />

              <button
                type="button"
                onClick={
                  input.id ? () => updatecustomer(input.id) : addCustomer
                }
                className="bg-gray-800 text-center text-white rounded-md p-2 w-full my-2"
              >
                {input.id ? "update " : "create "}customer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
