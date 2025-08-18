import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

//stripe is a payment gateway that allows you to accept payments online.
// It provides a secure and easy way to handle payments, subscriptions, and other financial transactions.
//STRIPE key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "https://susangat-food-del.onrender.com"  // Use environment variable
  console.log("Frontend URL being used:", frontend_url);
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    //after placing the order, we need to clear the cart data
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    //creating line items for stripe checkout session (payment link)
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        //give order in dollar
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      //redirecting to frontend after payment depending on success or failure
      //success_url and cancel_url are the urls where the user will be redirected after payment
      //if success then change the payment status to true
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
    console.log("Stripe session created with URLs:");
    console.log("Success URL:", `${frontend_url}/verify?success=true&orderId=${newOrder._id}`);
    console.log("Cancel URL:", `${frontend_url}/verify?success=false&orderId=${newOrder._id}`);
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


// verifying user order
const verifyOrder = async (req, res) => {
  // success is a boolean value that indicates whether the payment was successful or not
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      //if payment is successful then update the order status to paid
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    } 
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};



// user orders function for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing all user orders for in  admin pannel
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      //this will list all the orders placed by users
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


// api for updating order status 
const updateStatus = async (req, res) => {
  try {
    //find the user by userId and check if the user is admin
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status,});
      res.json({ success: true, message: "Status Updated Successfully" });
    }else{
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
