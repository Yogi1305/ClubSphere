import mongoose from "mongoose";

const QuestionSchema=mongoose.Schema({
    Question:{
        type:String,
        required:true,
    },
    Options:{
      type:[String],
    }
    ,
    Answer:{
       type:String
    }
});

export const QuestionModel=mongoose.model("QuestionModel",QuestionSchema);