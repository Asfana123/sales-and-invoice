import Login from './Pages/login'
import Dashboard from './Pages/Dashboard'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Customers from './Pages/Customers'

function App() {
  return (
    <>

      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/customer' element={<Customers/>}/>
      </Routes>
 
    </>
  )
}

export default App
