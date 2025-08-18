import React, { useContext, useState, useEffect, useRef } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { token, admin, setToken, setAdmin } = useContext(StoreContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken("");
    setAdmin(false);
    setShowDropdown(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      {token && admin ? (
        <div className="admin-panel-text">
          <h2>Admin Panel</h2>
        </div>
      ) : (
        <p className="login-conditon" onClick={()=>navigate("/")}>Login</p>
      )}
      <div className="profile-container" ref={dropdownRef}>
        <img 
          className="profile" 
          src={assets.profile_image} 
          alt="" 
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {showDropdown && token && admin && (
          <div className="dropdown-menu">
            <p onClick={logout}>Logout</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar
