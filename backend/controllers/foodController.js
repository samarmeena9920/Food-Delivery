import foodModel from "../models/foodModel.js";
import fs from "fs";    
//importing the filesystem module which is used to interact with the file system


//add food item
const addFood= async (req, res) => {

    let image_filename = `${req.file.filename}`; //getting the file name from the request object
    
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename //storing the file name in the database
});
    try {
        await food.save(); //saving the food item to the database
        res.json({success: true, message: "Food item added successfully"}); //sending the response with success message and food item
    } catch (error) {
        console.log(error); //logging the error to the console
        res.json({success: false, message: "Failed to add food item"}); //
    }
}


//all food list displaying
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({}); //fetching all food items from the database
        res.json({success: true, data: foods}); //sending the response with success message and food items
    } catch (error) {
        console.log(error); //logging the error to the console
        res.json({success: false, message: "Failed to fetch food items"}); //sending the response with failure message
    }

}

//removing food item
const removeFood = async (req, res) => {
    try{
        //finding the food item by id
        const food = await foodModel.findById(req.body.id);
        //unlinking the image file from the uploads folder
        fs.unlinkSync(`uploads/${food.image}`,()=>{});
        //deleting the image file from the uploads folder
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Food item removed successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Failed to remove food item"});
    }
}


export { addFood, listFood, removeFood };