import mongoose from "mongoose";
const quizContestSchema = new mongoose.Schema(
  {

     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     },
    contestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Contest"
        },
    
    questionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"QuestionModel"
    },
    selectedOption:{
        type:String,
    }
  });

export const QuizContest = mongoose.model("QuizContest", quizContestSchema);