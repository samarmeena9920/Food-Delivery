/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const Navbar = ({ setShowLogin }) => {

  //create a state variable to manage the active menu item
  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  //using useNavigate hook to navigate to different pages
  const navigate=useNavigate();
  //using useLocation hook to get current route
  const location = useLocation();
  
  //check if current page is homepage
  const isHomePage = location.pathname === '/';
  
  // Debug: Check what images are being loaded
  console.log('Current page:', location.pathname);
  console.log('Is homepage:', isHomePage);
  console.log('Logo source:', isHomePage ? assets.logo : assets.logo1);
  console.log('Search icon source:', isHomePage ? assets.search_icon : assets.search_icon1);
  
  //logout function to clear the token and redirect to home
  const logout=()=>{
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logout Successfully")
    navigate("/");
  }

  return (
    <div className={`navbar ${isHomePage ? 'homepage' : ''}`}>
      <Link to={'/'}><img src={isHomePage ? assets.logo : assets.logo1} alt="" className="logo" /></Link>
      <ul className='navbar-menu'>
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile-App</a>
        <a href='#footer' onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>Contact Us</a>
      </ul>
      <div className='navbar-right'>
        <img src={isHomePage ? assets.search_icon : assets.search_icon1} alt="search" />
        <div className='navbar-search-icon'>
          <Link to='/cart'><img src={isHomePage ? assets.basket_icon : assets.basket_icon1} alt="cart" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className="navbar-profile">
            <img src={isHomePage ? assets.profile_icon : assets.profile_icon1} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>}
      </div>
    </div>
  )
}

export default Navbar



