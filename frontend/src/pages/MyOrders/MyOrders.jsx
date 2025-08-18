/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
    // Using context to get the API URL and token
    const { url, token } = useContext(StoreContext);
    // State to hold the orders data
    const [data, setData] = useState([]);


    const fetchOrders = async () => {
        // Making a POST request to fetch user orders,token is included in the headers for authentication
        const response = await axios.post(url + "/api/order/userorders",{},{ headers: { token } });
        // If the response is successful, update the data state
        if (response.data.success) {
            setData(response.data.data);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className="my-orders">
            <h2>Orders</h2>
            <div className="container">
                {/* Mapping through the orders data to display each order */}
                {data.map((order, index) => {
                    return (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="" />
                            {/* looping the array of orders  */}
                            <p>
                                {order.items.map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return item.name + " X " + item.quantity;
                                    } else { // If it's not the last item, add a comma
                                        return item.name + " X " + item.quantity + ",";
                                    }
                                })}
                            </p>
                            <p>${order.amount}.00</p>
                            <p>items: {order.items.length}</p>
                            <p>
                                <span>&#x25cf;</span>
                                <b> {order.status}</b>
                            </p>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyOrders;
