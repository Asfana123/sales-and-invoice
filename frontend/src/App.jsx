import Login from './Pages/login'
import Dashboard from './Pages/Dashboard'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Customers from './Pages/Customers'
import Product from './Pages/Product'
import Invoice from './Pages/Invoice'
import CreateInvoice from './Pages/CreateInvoice'

function App() {
  return (
    <>

      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/customer' element={<Customers/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path='/invoice' element={<Invoice/>}/>
        <Route path='/create Invoice' element={<CreateInvoice/>}/>
      </Routes>
 
    </>
  )
}

export default App
