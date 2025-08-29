import express from"express"
import dotenv from "dotenv"
import { connectDb } from "./db/DBconnect.js";
import userRoute from "../backend/routes/userRoute.js"
import postRoute from "../backend/routes/postRoute.js"
import paymentRoute from "../backend/routes/paymentRoute.js"
import votingRoute from "../backend/routes/votingRoute.js"
import otpRoute from "../backend/routes/optRoute.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import razorpay from "razorpay"
dotenv.config();

const app =express();
app.use(cors({
    // origin: 'https://quizzy13.vercel.app',
   
    origin:'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept','X-User-Id'], 
    credentials:true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

connectDb();


app.use("/",userRoute);
app.use("/post",postRoute);
app.use("/payment",paymentRoute);
app.use("/voting",votingRoute)
app.use("/otp",otpRoute);

app.listen(8000 ,()=>{
    
    console.log("server is established");
    
});

