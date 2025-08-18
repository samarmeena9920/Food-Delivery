import mongoose from "mongoose";

//this to store food items in the database
//required true means that this field is mandatory
const foodSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price:{type: Number, required: true} ,  // price of the food item
    image: {type: String, required: true}, // image URL of the food item
    category: {type: String, required: true}, // category of the food item
})

// create a model for the food items

//if the model already exists, use it; otherwise, create a new one 
const foodModel = mongoose.model.food || mongoose.model("Food", foodSchema);
// export the food model to use it in other files
export default foodModel;