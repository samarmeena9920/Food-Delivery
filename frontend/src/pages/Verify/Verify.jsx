import React, { useContext, useEffect, useState, useCallback } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from "react-toastify";

const Verify = () => {
    // useSearchParams is used to get the query parameters from the url
    const [searchParams,setSearchParams]=useSearchParams();
    //getting the key and value from the url ( success and orderId key)
    const success=searchParams.get("success");
    const orderId=searchParams.get("orderId");
    const {url} =useContext(StoreContext);
    const navigate= useNavigate();
    
    // State for managing loading and verification status
    const [isLoading, setIsLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState(null);
    
    // Debug logging
    console.log("Verify component loaded");
    console.log("Current URL:", window.location.href);
    console.log("Search params - success:", success, "orderId:", orderId);
    console.log("Backend URL:", url);

    // verifyPayment function is used to verify the payment status of the order
    const verifyPayment = useCallback(async()=>{
        if (!success || !orderId) {
            toast.error("Invalid payment parameters");
            navigate("/");
            return;
        }
        
        setIsLoading(true);
        try {
            console.log("Verifying payment with:", { success, orderId });
            //calling api and checking the payment status
            const response= await axios.post(url+"/api/order/verify",{success,orderId});
            console.log("Payment verification response:", response.data);
            
            if(response.data.success){
                setVerificationStatus("success");
                toast.success("Order Placed Successfully");
                // Add a delay to show success message before navigating
                setTimeout(() => {
                    navigate("/myorders");
                }, 6000);
            }else{
                setVerificationStatus("failed");
                toast.error(response.data.message || "Payment verification failed");
                setTimeout(() => {
                    navigate("/");
                }, 6000);
            }
        } catch (error) {
            console.error("Payment verification error:", error);
            setVerificationStatus("failed");
            toast.error("Something went wrong during payment verification");
            setTimeout(() => {
                navigate("/");
            }, 6000);
        } finally {
            setIsLoading(false);
        }
    }, [success, orderId, url, navigate, setIsLoading, setVerificationStatus])

    // useEffect is used to call the verifyPayment function when the component is mounted
    useEffect(()=>{
        verifyPayment();
    },[verifyPayment]) // Now properly includes verifyPayment as dependency

  return (
    <div className='verify'>
        {isLoading ? (
            <div>
                {/* this will display till payment verify */}
                <div className="spinner"></div>
                <p style={{textAlign: 'center', marginTop: '20px', fontSize: '18px'}}>
                    Verifying your payment...
                </p>
            </div>
        ) : (
            <div style={{textAlign: 'center', padding: '50px'}}>
                {verificationStatus === "success" ? (
                    <div>
                        <div style={{fontSize: '60px', color: 'green', marginBottom: '20px'}}>✓</div>
                        <h2 style={{color: 'green', marginBottom: '10px'}}>Payment Successful!</h2>
                        <p>Your order has been placed successfully.</p>
                        <p>Redirecting to your orders...</p>
                    </div>
                ) : (
                    <div>
                        <div style={{fontSize: '60px', color: 'red', marginBottom: '20px'}}>✗</div>
                        <h2 style={{color: 'red', marginBottom: '10px'}}>Payment Failed!</h2>
                        <p>There was an issue with your payment.</p>
                        <p>Redirecting to home page...</p>
                    </div>
                )}
            </div>
        )}
    </div>
  )
}

export default Verify
