import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    contact: {
      type: Number,
    },
    isAdmin: {
      type: Boolean,
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
    poll: { type: Number, default: 0 },
   
  },
   
  

  { timestamps: true }
);

export const User = mongoose.model("User", userModel);
