import React from "react";
import "./Orders.css";
import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);

  useEffect(() => {
    if (!admin || !token) {
      navigate("/");
    }
  }, [admin, token, navigate]);

  // State to hold the orders data coming form api
  const [orders, setOrders] = useState([]);

  const fetchAllOrder = useCallback(async () => {
    console.log("Fetching orders with token:", !!token);
    console.log("Admin status:", admin);
    console.log("URL:", url + "/api/order/list");
    try {
      // Making a GET request to fetch all orders
      const response = await axios.get(url + "/api/order/list", {headers: { token },});
      console.log("Orders API response:", response.data);
      if (response.data.success) {
        console.log("Orders fetched successfully:", response.data.data?.length || 0, "orders");
        setOrders(response.data.data);
      }else{
        console.error("Error fetching orders:", response.data.message);
        toast.error("Error fetching orders: " + response.data.message);
      }
    } catch (error) {
      console.error("Network error fetching orders:", error);
      toast.error("Network error fetching orders");
    }
  }, [url, token, admin]);


  // Function to handle the status change of an order in admin panel
  const statusHandler = async (event, orderId) => {
    // Making a POST request to update the order status
    const response = await axios.post(url + "/api/order/status",{ orderId,status: event.target.value, },{ headers: { token } });
    if (response.data.success) {
      toast.success(response.data.message);
      // Fetching all orders again to reflect the updated status
      await fetchAllOrder();
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    // if (!admin && !token) {
    //   toast.error("Please Login First");
    //   navigate("/");
    // }
    if (token && admin) {
      fetchAllOrder();
    }
  }, [token, admin, fetchAllOrder]);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {// If it's not the last item, add a comma
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode} </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
