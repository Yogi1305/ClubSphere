import mongoose from "mongoose";
import { User } from "./User.js";
import { Contest } from "./Contest.js";

const QuizSchema=mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    ContestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Contest"
    },
    wrongAnswer:[{type:String}],
    correctAnswer:[{type:String}],
    correctAnswerCount: { type: Number, default: 0 }
});


export const Quiz=mongoose.model("Quiz",QuizSchema);