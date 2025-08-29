import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Baseurl } from "../main";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';


const ContestQuestion = () => {
  const location = useLocation();
  const [contest, setContest] = useState(null); // Use state instead of let variable
  const [loading, setLoading] = useState(true); // Add loading state
  const [disabledQuestions, setDisabledQuestions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const Navigate = useNavigate();

  const getContestById = async () => {
    try {
      setLoading(true);
      const contestId = localStorage.getItem("contestid");
      
      if (!contestId) {
        toast.error("No contest ID found");
        setLoading(false);
        return;
      }

      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${Baseurl}/post/getContestById/${contestId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      const contestData = response?.data?.contest;
      console.log(contestData);
      
      if (contestData) {
        setContest(contestData);
      } else {
        toast.error("Contest data not found");
      }
      
      localStorage.removeItem("contestid");
    } catch (error) {
      console.log("Error in contestQuestion page frontend", error);
      toast.error("Failed to load contests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContestById();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="p-8 bg-white rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-indigo-600">Loading...</h2>
          <p className="mt-4 text-gray-700">Please wait while we load the contest.</p>
        </div>
      </div>
    );
  }

  // Enhanced validation for contest and QuestionSet
  if (
    !contest ||
    !contest.QuestionSet ||
    !Array.isArray(contest.QuestionSet) ||
    contest.QuestionSet.length === 0
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="p-8 bg-white rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-red-500">Oops!</h2>
          <p className="mt-4 text-gray-700">
            {!contest
              ? "No contest data available."
              : !contest.QuestionSet
              ? "QuestionSet is missing from contest data."
              : !Array.isArray(contest.QuestionSet)
              ? "QuestionSet is not an array. Check if questions are properly populated."
              : "No questions available for this contest."}
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
            <strong>Debug Info:</strong>
            <pre>
              {JSON.stringify(
                {
                  hasContest: !!contest,
                  hasQuestionSet: !!contest?.QuestionSet,
                  questionSetType: typeof contest?.QuestionSet,
                  isArray: Array.isArray(contest?.QuestionSet),
                  length: contest?.QuestionSet?.length,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  const handleOptionClick = async (option, QuestionId) => {
    try {
      const UserId = localStorage.getItem("userId1");
      const ContestId = contest._id;

      const response = await axios.post(
        `${Baseurl}/post/answer`,
        { UserId, ContestId, QuestionId, Answer: option },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // console.log("Answer submitted successfully:", response.data);

      // Show success toast
      toast.success("Answer submitted successfully!");

      // Disable the question after answering
      setDisabledQuestions((prevState) => ({
        ...prevState,
        [QuestionId]: true,
      }));

      // Move to next question automatically after a brief delay
      if (currentQuestionIndex < contest.QuestionSet.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 1000);
      }
    } catch (error) {
      console.error("Error handling option click", error);
      toast.error("Failed to submit answer. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < contest.QuestionSet.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const currentQuestion = contest.QuestionSet[currentQuestionIndex];

  // Additional safety check for current question
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="p-8 bg-white rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-red-500">Error!</h2>
          <p className="mt-4 text-gray-700">
            Current question data is not available.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
            <strong>Debug Info:</strong>
            <pre>
              {JSON.stringify(
                {
                  currentQuestionIndex,
                  totalQuestions: contest.QuestionSet?.length || 0,
                  currentQuestion: currentQuestion,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-6">
      <ToastContainer />

      <div className="max-w-4xl mx-auto">
        {/* Contest Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 shadow-xl border border-white/20"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            {contest.title}
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="px-4 py-2 bg-purple-600/50 rounded-full text-white text-sm font-medium">
              Question {currentQuestionIndex + 1} of{" "}
              {contest.QuestionSet.length}
            </div>
          </div>
        </motion.div>

        {/* Question Navigation */}
        <div className="flex justify-center mb-6 overflow-x-auto py-2 px-4 bg-white/5 backdrop-blur-sm rounded-xl">
          <div className="flex space-x-2">
            {contest.QuestionSet.map((question, index) => (
              <button
                key={question._id || index}
                onClick={() => navigateToQuestion(index)}
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                  index === currentQuestionIndex
                    ? "bg-purple-600 text-white font-bold"
                    : disabledQuestions[question._id]
                    ? "bg-green-500 text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Question */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              {currentQuestion.Question || currentQuestion.question}
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Check for different possible field names for options */}
              {(currentQuestion.Options || currentQuestion.options) &&
              Array.isArray(
                currentQuestion.Options || currentQuestion.options
              ) ? (
                (currentQuestion.Options || currentQuestion.options).map(
                  (option, optionIndex) => (
                    <motion.button
                      key={optionIndex}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={disabledQuestions[currentQuestion._id]}
                      onClick={() =>
                        handleOptionClick(option, currentQuestion._id)
                      }
                      className={`p-4 rounded-lg text-left transition-all ${
                        disabledQuestions[currentQuestion._id]
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-indigo-50 hover:bg-indigo-100 text-indigo-900 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-600 text-white font-bold mr-3">
                          {String.fromCharCode(65 + optionIndex)}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                    </motion.button>
                  )
                )
              ) : (
                <div className="col-span-2">
                  <div className="text-center text-gray-500 mb-4">
                    No options available for this question.
                  </div>
                  <div className="p-4 bg-gray-100 rounded text-sm">
                    <strong>Debug - Current Question Structure:</strong>
                    <pre>{JSON.stringify(currentQuestion, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between p-4 bg-gray-50">
            <button
              onClick={() =>
                navigateToQuestion(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-lg ${
                currentQuestionIndex === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                navigateToQuestion(
                  Math.min(
                    contest.QuestionSet.length - 1,
                    currentQuestionIndex + 1
                  )
                )
              }
              disabled={currentQuestionIndex === contest.QuestionSet.length - 1}
              className={`px-4 py-2 rounded-lg ${
                currentQuestionIndex === contest.QuestionSet.length - 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Next
            </button>
            {
              currentQuestionIndex === contest.QuestionSet.length - 1 && (
                <button
      onClick={()=>Navigate('/contest')} 
      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
    >
      Submit
    </button>
              )
            }
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-6 bg-white/10 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
            style={{
              width: `${
                (Object.keys(disabledQuestions).length /
                  contest.QuestionSet.length) *
                100
              }%`,
            }}
          />
        </div>
        <p className="text-center text-white mt-2">
          {Object.keys(disabledQuestions).length} of{" "}
          {contest.QuestionSet.length} questions answered
        </p>
      </div>
    </div>
  );
};

export default ContestQuestion;