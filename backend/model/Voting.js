import mongoose from "mongoose";


const votingModel= mongoose.Schema({
    Title:{
        type:String,
        required:true,
    },
   Organization:{
    type:String
   },
    Optionsize:{
          type:Number,
          required:true
    },
     
  Participate:[{name:String,count:[{type:String}]}],
  Totalvoter:[{type:String}],
  Starttime:{
    type:Date,
    required:true
  }
  ,Endtime:{
    type:Date,
    required:true
  }
  
    
},{timestamps:true})

export const  Voting =mongoose.model("Voting",votingModel);