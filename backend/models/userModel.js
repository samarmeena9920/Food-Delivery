import mongoose from "mongoose";

// define the user schema for the user model
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default:"user" },
    cartData: { type: Object, default: {} },
  },
//   if the collection is empty, it will not create an empty object
  { minimize: false }
);

// create the user model if it does not already exist
const userModel = mongoose.model.user || mongoose.model("user", userSchema);
export default userModel;
