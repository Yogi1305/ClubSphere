import mongoose from "mongoose";


const feedbackSchema = new mongoose.Schema({
  club: {
    type: String,
    
  },
  title: {
    type:String
  },
  description: {
    type: String,
    
  },
  type:{
    type:String
  }
}, { timestamps: true });

// Ensure user can't join the same club twice
// clubMemberSchema.index({ Club: 1, UserId: 1 }, { unique: true });

export default mongoose.model("Feedback", feedbackSchema);
