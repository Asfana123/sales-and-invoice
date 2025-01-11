import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

  document.title='Dashboard'
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    console.log(token)

    if (!token) {
      navigate('/')
    } else {
      axios.get("http://127.0.0.1:8000/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((Response) => {
        console.log(Response.data)
      })
      .catch((error) => {
        console.log(error.Response)
      })
    }
  }, [navigate]) 

  const logout=()=>{

    localStorage.removeItem('access_token')
    navigate('/')
  }

  return (
    
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Welcome to Dashboard</h1>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/customer')}
            className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition duration-300"
          >
            Customers
          </button>
  
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
  )
}

export default Dashboard
