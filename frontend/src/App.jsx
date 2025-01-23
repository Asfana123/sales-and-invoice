import Login from './Pages/login'
import Dashboard from './Pages/Dashboard'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Customers from './Pages/Customers'
import Product from './Pages/Product'
import Invoice from './Pages/Invoice'
import CreateInvoice from './Pages/CreateInvoice'
import NotFound from './Pages/NotFound'
import ViewInvoice from './Pages/ViewInvoice'

function App() {
  return (
    <>

      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/customer' element={<Customers/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path='/invoice' element={<Invoice/>}/>
        <Route path='/create_Invoice/:id?' element={<CreateInvoice/>}/>
        <Route path='view_invoice/:id' element={<ViewInvoice/>}/>
        <Route path="*" element={<NotFound />} />

      </Routes>
 
    </>
  )
}

export default App
