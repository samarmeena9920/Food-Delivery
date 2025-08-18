import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js'; 
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js'; 
import 'dotenv/config'; 


//app config
const app = express();
const PORT = 4000;

//middleware
app.use(cors());
app.use(express.json());

// database connection
connectDB();

//api endpoints
app.use('/api/food', foodRouter);

//to show the image in frontend using link 
// we have mounted the uploads folder to the /images endpoint
app.use('/images', express.static('uploads'));

app.use('/api/user', userRouter); 

app.use('/api/cart', cartRouter);

app.use('/api/order', orderRouter); 

// get method used to fetch data from the server side and send it to the front end as a response.
app.get('/', (req, res) => {
  res.send('API Working');
});

// listen method used to start the server and listen for incoming requests on the specified port.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// mongodb+srv://hirendrakurche423:1234567809@cluster0.zhivqp3.mongodb.net/?