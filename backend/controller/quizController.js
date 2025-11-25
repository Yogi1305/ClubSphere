import { QuestionModel } from "../model/Question.js";
import { QuizContest } from "../model/QuizContest.js";
import { Quiz } from "../model/QuizSc.js";


export const saveAnswer = async (req, res) => {
    try {
        const { UserId, ContestId, QuestionId, Answer } = req.body;

        // console.log(Answer);
        

        const question = await QuestionModel.findOne({ _id: QuestionId });
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const isCorrect = question.Answer === Answer; 
        
        let quiz = await Quiz.findOne({ UserId, ContestId });

        if (!quiz) {
            
            quiz = new Quiz({
                UserId,
                ContestId,
                wrongAnswer: isCorrect ? [] : [QuestionId],
                correctAnswer: isCorrect ? [QuestionId] : [],
                correctAnswerCount: isCorrect ? 1 : 0
            });
            await quiz.save();
        } else {
          
            if (isCorrect) {
               
                if (!quiz.correctAnswer.includes(QuestionId) && !quiz.wrongAnswer.includes(QuestionId)) {
                    quiz.correctAnswer.push(QuestionId);
                    quiz.correctAnswerCount += 1;
                }
            } else {
                
                if (!quiz.wrongAnswer.includes(QuestionId) && !quiz.correctAnswer.includes(QuestionId)) {
                    quiz.wrongAnswer.push(QuestionId);
                }
            }
            await quiz.save();
        }
        const quizz= await QuizContest.create({
         userId:UserId,
         contestId:ContestId,
         questionId:QuestionId,
         selectedOption:Answer
    })
        res.status(200).json({ message: "Answer saved successfully", quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const saveAnswer1 = async (req, res) => {
  try {
    const { UserId, ContestId, QuestionId, Answer } = req.body;

    const question = await QuestionModel.findById(QuestionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const isCorrect = question.Answer === Answer;

    // Use MongoDB atomic update
    const update = isCorrect
      ? {
          $addToSet: { correctAnswer: QuestionId }, // prevents duplicates
          $inc: { correctAnswerCount: 1 }
        }
      : { $addToSet: { wrongAnswer: QuestionId } };

    const quiz = await Quiz.findOneAndUpdate(
      { UserId, ContestId },
      {
        $setOnInsert: {
          UserId,
          ContestId,
          correctAnswer: [],
          wrongAnswer: [],
          correctAnswerCount: 0
        },
        ...update
      },
      { upsert: true, new: true } // create if not exists, return updated doc
    );
   
    const quizz= await QuizContest.create({
         userId:UserId,
         contestId:ContestId,
         questionId:QuestionId,
         selectedOption:Answer
    })

    

    res.status(200).json({ message: "Answer saved successfully", quiz });
  } catch (error) {
    console.error("Error saving answer:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getQuizResults = async (req, res) => {
    try {
        const { contestId } = req.params;
        const userId = req.id;

        console.log("ContestId:", contestId);
        console.log("UserId:", userId);

        const quiz = await QuizContest.find({
            userId: userId,
            contestId: contestId
        }).populate("questionId");

       
        if (quiz.length === 0) {
            return res.status(404).json({ message: "No quiz results found" });
        }

        res.status(200).json({ quiz });

    } catch (error) {
        console.error("Error fetching quiz results:", error);
        res.status(500).json({ message: "Server error" });
    }
};



