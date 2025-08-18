/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, useLocation} from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Debug from './pages/Debug/Debug'
const App = () => {

  // creating a state variable for login popup
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <>
      {/* LoginPopup component to show the login popup if true is set to false and the login popup will not be shown. If true then the login popup will be shown.*/}
    {showLogin? <LoginPopup setShowLogin={setShowLogin}/> : <> </>}
      <div className={`app ${isHomePage ? 'home-page' : ''}`}>
        <Navbar setShowLogin={setShowLogin} />
        {/* Routes is used to define the different pages of the application */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/debug' element={<Debug />} />
          <Route path='/myorders' element={<MyOrders />} />
        </Routes>
      </div>
      <Footer/>
    </>
  )
}

export default App
