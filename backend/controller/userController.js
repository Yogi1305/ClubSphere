
import { User } from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import PushNotification from "../model/pushnotification.js";
dotenv.config();





// register
export const register=async(req,res)=>{

    const {fullName,email,contact,passWord,Batch}=req.body;

    if(!fullName || !email ||!contact || !passWord || !Batch)
        return res.status(400).json({message :"all field are required"});
    const finduser= await User.findOne({email});
    if(finduser)
      return res.status(200).json({message:"user alreday exit"});
    const hashpassword= await bcrypt.hash(passWord,10);

    const newuser= User.create({
        fullName,
        email,
        contact,
        passWord:hashpassword,
        role:"USER",
      contestgiven: [],
      count: 0,
      poll: 0,
      Batch
    })

    await newuser.save;
    return res.status(201).json({
        message: "Account created successfully",
        success: true,
      });
}

// login

export const login=async(req,res)=>{
    // fet userid
    // console.log("User ID:", req.body);
    const{email,passWord,pushsubscription}=req.body
    if(!passWord || !email || !pushsubscription)
        return res.status(400).json({message:"all fields are required"});
   
    const user=await User.findOne({email});
    if(!user)
        return res.status(400).json({message:"user is not register"});
    
    const ispassword= await bcrypt.compare(passWord,user.passWord);
    if(!ispassword)
        return res.status(400).json({message:"incorrect password"});
    
     //  generate jwt token
      const tokenData = { userId: user._id , role: user.role};
      const token =  jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      // console.log("token is ",token);
      // firebasetoken
      const newfire= await PushNotification.create({
        userId: user._id,
        subscription: JSON.parse(pushsubscription)
      });
     
      console.log("Firebase token saved:", newfire);
      return res
        .cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .status(200)
        .json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          contact: user.contact,
          success: true,
          message: `Welcome back ${user?.fullName?.toUpperCase()}`,
        });
    };
    // logout
    export const logout = async(req, res) => {
      try {
        const {userId}=req.id;
        const user= await User.findOne({userId});
        if(user){
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
          message: `${user.fullName} logged out successfully.`,
        });}
      } catch (error) {
        console.log(error);
      }
    };
    // checklogging

    export const checklogging=async(req,res)=>{
          return res.status(200).json({success:true});
    }
// admin

export const Admin= (req,res)=>{
      return res.status(200).json({message:"admin",success:true,role:req.role})
}
export const completecontest = async (req, res) => {
  try {
    const { contestId, userId } = req.body;
    // console.log(contestId, userId);

    const user = await User.findById({ _id: userId }); // Correct way to fetch a user

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // const alreadyGiven = user.contestgiven.some(id => id=== contestId);
   const alreadyGiven = user.contestgiven.some(
  id => id.toString() === contestId.toString()
);




    if (alreadyGiven) {
      return res.status(200).json({ success: true });
    }

    user.contestgiven.push(contestId);
    await user.save();

    return res.status(200).json({ success: false });
  } catch (error) {
    console.error("Error in completecontest:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const userinfo=async(req,res)=>{
   const userId=req.id;
   console.log(userId);
   
  
   const user = await User.findById(userId)
      .populate({
        path: "contestgiven",
        select: "title startDate endDate creator description", // include the fields you need from Contest
      });
      if(!user)
    return res.status(200).json({message:"no user found"})
  return res.status(200).json(user.contestgiven);
}

export const userdata=async(req,res)=>{
   const{userId}=req.params;
   console.log(userId); 
   const user = await User.findById({ _id: userId });
      if(!user)
    return res.status(200).json({message:"no user found"})
  return res.status(200).json(user);
}


export const resetpassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.passWord = hashedPassword;
  await user.save();

  return res.status(200).json({ message: "Password reset successfully" });
};


