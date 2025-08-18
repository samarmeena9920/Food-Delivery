import React, { useContext, useEffect } from "react";
import "./Login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";


const Login = ({ url }) => {
  const navigate = useNavigate();
  const { admin, setAdmin, token, setToken } = useContext(StoreContext);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [isRegister, setIsRegister] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    console.log("Login attempt with data:", data);
    try {
      const response = await axios.post(url + "/api/user/login", data);
      console.log("Login response:", response.data);
      console.log("Response success:", response.data.success);
      console.log("Response role:", response.data.role);
      if (response.data.success) {
        if (response.data.role === "admin") {
          console.log("User is admin, setting token and navigating");
          setToken(response.data.token);
          setAdmin(true);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("admin", "true");
          toast.success("Login Successfully");
          // Add a small delay to ensure state is updated
          setTimeout(() => {
            navigate("/add");
          }, 100);
        } else {
          console.log("User is not admin, role:", response.data.role);
          toast.error("You are not an admin");
        }
      } else {
        console.log("Login failed:", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const onRegister = async (event) => {
    event.preventDefault();
    if (!data.email || !data.password || !data.name) {
      toast.error("Please fill all fields");
      return;
    }
    console.log("Registration attempt with data:", data);
    try {
      const response = await axios.post(url + "/api/user/register", {
        email: data.email,
        password: data.password,
        name: data.name,
        role: "admin"
      });
      console.log("Registration response:", response.data);
      console.log("Registration success:", response.data.success);
      console.log("Registration message:", response.data.message);
      if (response.data.success) {
        toast.success("Registration successful. Please login.");
        setIsRegister(false);
        setData({ email: "", password: "", name: "" });
      } else {
        console.log("Registration failed:", response.data.message);
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    if (admin && token) {
      navigate("/add");
    }
  }, [admin, token, navigate]);

  return (
    <div className="login-popup">
      <form onSubmit={isRegister ? onRegister : onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{isRegister ? "Admin Registration" : "Login"}</h2>
        </div>
        <div className="login-popup-inputs">
          {isRegister && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Your password"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={!data.email || !data.password || (isRegister && !data.name)}
          onClick={() => console.log("Button clicked, form will submit")}
        >
          {isRegister ? "Register" : "Login"}
        </button>
        <div style={{ marginTop: 10, textAlign: "center" }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button 
                type="button" 
                style={{ color: 'tomato', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }} 
                onClick={() => {
                  console.log("Switching to login");
                  setIsRegister(false);
                  setData({ email: "", password: "", name: "" });
                }}
              >
                Login
              </button>
            </span>
          ) : (
            <span>
              New admin?{' '}
              <button 
                type="button" 
                style={{ color: 'tomato', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }} 
                onClick={() => {
                  console.log("Switching to register");
                  setIsRegister(true);
                  setData({ email: "", password: "", name: "" });
                }}
              >
                Register
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
