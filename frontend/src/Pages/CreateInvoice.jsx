import React, { useState } from 'react'
import axios from 'axios'

const CreateInvoice = () => {
  const [customers, setCustomer]=useState([])
  const [products, setProduct]=useState([])
  const [modal, setModal]=useState(false)
  const [modalType, setModalType]=useState('')
  const [selectProducts, setSelectProducts]=useState([])
  const token=localStorage.getItem('access_token')


  const fetchCustomer=()=>{
    axios.get('http//:127.0.0.1:8000/customer',{
      headers: {Authorization:`Bearer ${token}`}
    })
    .then((response)=>setCustomer(response.data))
    .catch((error)=>console.log(error.response.data))
  }
  const fetchProduct=()=>{
    axios.get('http://127.0.0.1:8000/product',{
      headers :{
        Authorization : `Bearer ${token}`
      }})
      .then((response)=>setProduct(response.data))
      .catch((error)=>console.log(error.response.data))
  }


  return (
    <div>
      <button onClick={()=>{setModal(true), setModalType('customers')}}>select Customer</button>
      <button onClick={()=>{setModal(true), setModalType('products')}}>select Product</button>

      

      <ul>{selectProducts.map((product)=>
      <li>{product.id} , {product.name} {product.price} </li>
      )}
        
      </ul>


      <div className='fixed bg-gray-400 bg-opacity-50'>
        <div className='bg-white '>
          {modalType==='customers'&&
          <ul>{customers.map((cust)=>(
            <li>{cust.id} {cust.name} {cust.phone}</li>
          ))} 
          </ul>}

          {modalType=='products'&&
          <ul>{products.map((product)=>
          <li>{product.id} {product.name} {product.price}</li>)}
          </ul>}

        
        </div>
      </div>
      
    </div>
  )
}

export default CreateInvoice
