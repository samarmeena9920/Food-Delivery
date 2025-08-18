import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import "dotenv/config"

// login user
const loginUser = async (req, res) => {
    // reqest body contains the email and password of the user and destructuring them
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        // if user is not found then return the message
        if (!user) {
            return res.json({ success: false, message: "User Doesn't exist" });
        }
        // if user is found then check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
        const role = user.role;
        console.log("User logged in with role:", role);
        const token = createToken(user._id);
        res.json({ success: true, token, role });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
    // destructuring the name, email, password and role from the request body
    const { name, email, password, role } = req.body;
    console.log("Registration request received:", { name, email, role });
    console.log("Environment variables - SALT:", process.env.SALT, "JWT_SECRET:", !!process.env.JWT_SECRET);
    try {
        // checking user is already exist
        //awaits waits for the query to finish before moving on (because it's asynchronous).
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter valid email" });
        }
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Please enter strong password",
            });
        }

        //password is correct then register the user so 
        // hashing user password


        // What is salt?
        // A salt is a random string added to your password before hashing to make it more secure and prevent attacks like rainbow table attacks.

        // What is happening here?
        // bcrypt.genSalt(...) – generates a cryptographic salt.
        // process.env.SALT – is usually a number (e.g., "10") stored in your .env file, representing the salt rounds (how complex/time-consuming the salt should be).
        // Number(...) – converts it from a string to a number.
        // await – because genSalt is asynchronous.

        const saltRounds = process.env.SALT ? Number(process.env.SALT) : 10;
        console.log("Using salt rounds:", saltRounds);
        const salt = await bcrypt.genSalt(saltRounds);
        //hashing the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            role: role || "user", // Use provided role or default to "user"
        });

        // saving the user to the database
        const user = await newUser.save();
        const userRole = user.role;
        console.log("User registered with role:", userRole);
        // creating a token for the user using createToken function
        const token = createToken(user._id);
        res.json({ success: true, token, role: userRole });
    } catch (error) {
        console.log("Registration error:", error);
        console.log("Error details:", error.message);
        res.json({ success: false, message: error.message || "Error" });
    }
};

export { loginUser, registerUser };
