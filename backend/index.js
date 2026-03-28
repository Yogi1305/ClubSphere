import express from"express"
import dotenv from "dotenv"
import { connectDb } from "./db/DBconnect.js";
import userRoute from "../backend/routes/userRoute.js"
import postRoute from "../backend/routes/postRoute.js"
import paymentRoute from "../backend/routes/paymentRoute.js"
import votingRoute from "../backend/routes/votingRoute.js"
import otpRoute from "../backend/routes/optRoute.js"
import eventRoute from "../backend/routes/eventRoute.js"
import fileRoute from "../backend/routes/fileRoute.js"
import memberRoute from "../backend/routes/memberRoute.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import razorpay from "razorpay"
import  "./redis/worker.js" ;
import multer from "multer";
dotenv.config();
import swaggerUi from "swagger-ui-express"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");

// import swaggerDocument from "./swagger-output.json"
// import { swaggerSpec } from "./swagger.js";






const app =express();
// ✅ CORS configuration
const allowedOrigins = [
  "https://theclubsphere.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174"
  
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-User-Id"],
    credentials: true,
  })
);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

connectDb();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/",userRoute);
app.use("/post",postRoute);
app.use("/payment",paymentRoute);
app.use("/voting",votingRoute)
app.use("/otp",otpRoute);
app.use("/event",eventRoute);
app.use("/upload",fileRoute)
app.use("/member",memberRoute)

app.listen(8000 ,()=>{
    
    console.log("server is established");
    
});

