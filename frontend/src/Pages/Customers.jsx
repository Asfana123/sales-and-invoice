import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  const [input, setInput] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const token = localStorage.getItem("access_token");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log(token);
    if (!token) {
      navigate("/");
    } else {
      axios
        .get("http://127.0.0.1:8000/customer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setCustomer(response.data);
          console.log(customer);
        })

        .catch((error) => console.log(error));
    }
  }, [navigate]);

  const addCustomer = () => {
    axios
      .post("http://127.0.0.1:8000", input, {
        Authorization: `Bearer ${token}`,
      })
      .then((response) => response.data)
      .catch((error) => console.log(response.error));
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
      {customer.length > 0 ? (
        <div className="flex justify-center m-5">
          <table className="items-center w-3/4 ">
            <thead className="p-6 bg-gray-700 text-center text-white">
              <tr className="">
                <th>Id</th>
                <th>Name</th>
                <th>email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>edit</th>
              </tr>
            </thead>
            <tbody>
              {customer.map((cust, index) => (
                <tr key={cust.id} className="p-6  text-center text-md">
                  <td className="">{cust.id}</td>
                  <td>{cust.name}</td>
                  <td>{cust.email}</td>
                  <td>{cust.phone}</td>
                  <td>{cust.address}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No customers available.</p>
      )}

      {modal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-80  flex justify-center items-center z-10 p-7">
          <div className="bg-white p-4 rounded-md w-1/4 ">
            <button className="p-2" onClick={() => setModal(false)}>
              x
            </button>
            <h2 className="text-center font-medium text-2xl">
              Create Customer
            </h2>
            <form>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="name"
                className="p-2 w-full border border-lg rounded-md"
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="email id"
                className="p-2 w-full border border-lg rounded-md"
              />

              <label htmlFor="email">phone Number</label>
              <input
                type="email"
                placeholder="Phone Number"
                className="p-2 w-full border border-lg rounded-md"
              />

              <label htmlFor="email">address</label>
              <textarea
                id="address"
                placeholder="Enter your address"
                name="address"
                value={input.address}
                onChange={(e) =>
                  setInput({ ...input, [e.target.name]: e.target.value })
                }
                className="p-2 w-full border border-gray-300 rounded-md"
              />

              <button className="bg-gray-800 text-center text-white rounded-md p-2 w-full my-2">
                create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
