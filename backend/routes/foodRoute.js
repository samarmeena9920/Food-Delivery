import express from "express";
import {addFood,listFood, removeFood} from "../controllers/foodController.js";
import multer from "multer";

// multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
//creating rout to routing the request to the controller
const foodRouter = express.Router();

//image storage engine to store in the uploads folder
//diskStorage is a method of multer that allows you to store files on the disk
const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`); // appending the current timestamp to the original file name
    }
})

// multer middleware to handle file uploads
const upload = multer({storage: storage});

//post method used to send data to the server and it is proceeds to get response from the server
//using the upload middleware to handle file uploads and then calling the addFood controller
//the "/add" endpoint is used to add a new food item 
//post method is used to send data to the server and it is proceeds to get response from the server
//the upload.single("image") is used to handle single file upload with the field name "image"
//the addFood controller is used to handle the request and response for adding a new food item
foodRouter.post("/add", upload.single("image"), addFood);

//get method used to fetch data from the server side and send it to the front end as a response.
foodRouter.get("/list", listFood);

//delete method used to delete data from the server and it is proceeds to get response from the server
foodRouter.post("/remove", removeFood);
export default foodRouter;