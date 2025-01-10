import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
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
    <div>
      {/* <button>customers</button> */}
      <h1>Welcome to Dashboard</h1>
      <button onClick={(()=>{navigate('/customer')})}>customer</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default Dashboard
