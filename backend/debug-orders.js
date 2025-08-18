import userModel from "./models/userModel.js";
import orderModel from "./models/orderModel.js";
import { connectDB } from "./config/db.js";
import "dotenv/config";

// Debug script to check orders and admin users
const debugOrders = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log("=== DEBUG: Checking Admin Users ===");
    const adminUsers = await userModel.find({ role: "admin" });
    console.log("Admin users found:", adminUsers.length);
    adminUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log("\n=== DEBUG: Checking All Orders ===");
    const allOrders = await orderModel.find({});
    console.log("Total orders found:", allOrders.length);
    allOrders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`);
      console.log(`  - ID: ${order._id}`);
      console.log(`  - User ID: ${order.userId}`);
      console.log(`  - Amount: $${order.amount}`);
      console.log(`  - Status: ${order.status}`);
      console.log(`  - Items: ${order.items.length} items`);
      console.log(`  - Date: ${order.date}`);
      console.log(`  - Payment: ${order.payment ? 'Paid' : 'Pending'}`);
    });
    
    console.log("\n=== DEBUG: Checking All Users ===");
    const allUsers = await userModel.find({});
    console.log("Total users found:", allUsers.length);
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Debug error:", error);
    process.exit(1);
  }
};

debugOrders();
