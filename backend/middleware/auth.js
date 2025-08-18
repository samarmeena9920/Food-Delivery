import jwt from "jsonwebtoken";

// Description: This is a middleware for authentication of the users.
const authMiddleware = async (req, res, next) => {
  // Check if the request has a token in the headers
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  // Verify the token using jwt

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // Initialize req.body if it doesn't exist
    if (!req.body) {
      req.body = {};
    }
    // If the token is valid, attach the user ID to the request body that is take userid from the token
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
export default authMiddleware;
