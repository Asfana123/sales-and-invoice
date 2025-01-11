import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

function login() {
  const [input, setInput] = useState({ username: "", password: "" });
  const [error  ,setError]=useState("")
  const navigate=useNavigate()

  document.title='Login Page'

  const handlelogin = () => {
    axios.post("http://127.0.0.1:8000/", input, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("access_token",response.data.access_token)

        navigate('/dashboard');
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setError(error.response.data.errors)
      });
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-8">
        <h2 className="text-center text-2xl font-semibold">Login</h2>
        {error && <p className="font-semibold text-red-600">{error}</p>}
        <div className="">
          <label htmlFor="username" className="block font-medium p-3">
            username
          </label>
          <input
            type="text"
            name="username"
            placeholder="username"
            className=" p-2 border border-gray-200 rounded-md  w-full "
            value={input.username}
            onChange={(e) =>
              setInput({ ...input, [e.target.name]: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="password" className="block p-2 font-medium">
            password
          </label>
          <input
            className="w-full border border-md p-2 rounded-md"
            type="password"
            name="password"
            placeholder="password"
            value={input.password}
            onChange={(e) =>
              setInput({ ...input, [e.target.name]: e.target.value })
            }
          />
        </div>

        <button
          className="my-3 w-full bg-black text-white rounded-md p-2"
          onClick={handlelogin}
        >
          login
        </button>
      </div>
    </div>
  );
}

export default login;
