import mongoose from "mongoose";
import { ROLES } from "../utils/constant.js";

const userModel = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
    },

    contact: {
      type: Number,
    },
    
    passWord: {
      type: String,
      required: true,
    },
    contestgiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contest" }],
    count: {
      type: Number,
      default: 0,
    },
    role:{
      type:String,
      enum:ROLES,
      default:"USER"
    },
    poll: { type: Number, default: 0 },
    Batch:{
       type:Number,
       
    }
   
  },
   
  

  { timestamps: true }
);

export const User = mongoose.model("User", userModel);
