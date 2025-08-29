import { Quiz } from '../model/QuizSc.js';
import mongoose from 'mongoose';

export const getQuizResult = async (req, res) => {
  try {
    const { ContestId } = req.body;

    // Validate ContestId
    console.log(ContestId)
    if (!ContestId) {
      return res.status(400).json({ message: "ContestId is required" });
    }

    // Validate that ContestId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(ContestId)) {
      return res.status(400).json({ message: "Invalid ContestId format" });
    }

    const contestObjectId = new mongoose.Types.ObjectId(ContestId);

    // Aggregate to get results with user details, sorted by score
    const results = await Quiz.aggregate([
      {
        $match: { ContestId: contestObjectId },
      },
      {
        $lookup: {
          from: 'users', // The collection name is usually lowercase and plural
          localField: 'UserId',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData',
      },
      {
        $project: {
          userId: '$UserId',
          fullName: '$userData.fullName',
          email: '$userData.email',
          correctAnswerCount: 1,
          wrongAnswerCount: { $size: '$wrongAnswer' },
          totalAnswered: { 
            $add: [
              '$correctAnswerCount', 
              { $size: '$wrongAnswer' }
            ] 
          }
        },
      },
      {
        $sort: { 
          correctAnswerCount: -1,  // Primary sort by correct answers (desc)
          wrongAnswerCount: 1      // Secondary sort by wrong answers (asc)
        },
      },
    ]);

    // If no results found
    if (results.length === 0) {
      return res.status(404).json({ 
        message: "No participants found for this contest" 
      });
    }

    // Add rankings to the results
    const rankedResults = results.map((result, index) => ({
      ...result,
      rank: index + 1
    }));

    // Return the results with success message
    return res.status(200).json({ 
      message: "Contest results retrieved successfully",
      totalParticipants: results.length,
      results: rankedResults 
    });
    
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return res.status(500).json({ 
      message: "An error occurred while fetching results", 
      error: error.message 
    });
  }
};