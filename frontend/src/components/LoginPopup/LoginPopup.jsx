import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
// import { toast } from 'react-toastify';
//setShowlogin prop is come from App.jsx
//setShowLogin is a function that will be used to set the showLogin state variable to false


const LoginPopup = ({ setShowLogin }) => {

    // taking the url and setToken from StoreContext
    const { url, setToken } = useContext(StoreContext);
    const [currentState, setCurrentState] = useState("Login");

    // state variable to save the user data
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });

    // function to change the current state of the login popup 
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        // updating the data state variable with the new value
        setData((data) => ({ ...data, [name]: value }));
    };

    // to see in console the data state variable can use useEffect
    //     useEffect(() => {
    //         console(data)
    // }, [data]);


    // function to handle the login or signup 
    const onLogin = async (event) => {
        // preventing the default behaviour of the form - reloading the page
        event.preventDefault();
        let newUrl = url;
        if (currentState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }
        // using axios to make a post request to the server
        const response = await axios.post(newUrl, data);
        //if we suvceed in login or signup, we will get a token from the server  
        if (response.data.success) {
            
            // setting the token in the StoreContext and localStorage
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            // toast.success("Login Successfully")
            setShowLogin(false);
        } else {
            // toast.error(response.data.message);
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className='login-popup-container'>
                <div className="login-popup-title">
                    <h2>{currentState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {/* hiding the input name field in login */}
                    {/* whatever the change happen in input field is update using the onChangeHandler */}
                    {currentState === 'Login' ? <></> : (<input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder="Enter your name" required />)}
                    <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder="Enter your email" required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder="Enter your password" required />
                </div>
                <button type='submit'> {currentState === 'sign Up' ? 'Create  Account' : 'Login'}</button>
                <div className='login-popup-condition'>
                    <input type="checkbox" required />
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                </div>
                {/* checking the  current state and providing the below conditions */}
                {currentState === 'Login' ? <p>Create a new account? <span onClick={() => setCurrentState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrentState('Login')}>Login here</span></p>}

            </form>

        </div>
    )
}

export default LoginPopup
