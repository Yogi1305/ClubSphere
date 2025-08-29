import mongoose from "mongoose"


export const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("db is connected");
        
    } catch (error) {
        console.log("db connection error ",error);
        
    }
}