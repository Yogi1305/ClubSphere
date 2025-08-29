import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Baseurl } from "../main";
import QuestionForm from "./Question.jsx";
import Navbar from "./Navbar.jsx";
import AigeneratedQuestion from "./AigeneratedQuestion.jsx";
import { Eye } from "lucide-react";

// Modal component for the question form
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 animate-fadeIn">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const ContestCreation = () => {
  const navigate = useNavigate();
  
  // State for AI modal and selected contest
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedAiContestId, setSelectedAiContestId] = useState(null);

  // Handler to open AI modal with specific contest ID
  const handleOpenAiModal = (contestId) => {
    setSelectedAiContestId(contestId);
    setAiModalOpen(true);
    console.log("Opening AI modal for contest:", contestId);
  };

  // Handler to close AI modal
  const handleCloseAiModal = () => {
    setAiModalOpen(false);
    setSelectedAiContestId(null);
    console.log("Closing AI modal");
  };

  // State for contest creation
  const [contestData, setContestData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isPublic: false, // Default to private
  });

  // State for created contests
  const [contests, setContests] = useState([]);

  // State for loading and selected contest
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Load existing contests on component mount
  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    const userid = localStorage.getItem("userId1");
    setIsLoading(true);
    try {
      const response = await axios.get(`${Baseurl}/post/getcontest`, {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userid,
        },
        withCredentials: true,
      });
      console.log(response.data);
      setContests(response.data.contests);
    } catch (error) {
      console.error("Error fetching contests:", error);
      toast.error("Failed to load contests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContestChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContestData({
      ...contestData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const createContest = async (e) => {
    e.preventDefault();

    // Combine date and time for start and end dates
    const startDateTime = new Date(
      `${contestData.startDate}T${contestData.startTime}`
    );
    const endDateTime = new Date(
      `${contestData.endDate}T${contestData.endTime}`
    );

    // Validate dates
    if (endDateTime <= startDateTime) {
      toast.error("End date must be after start date");
      return;
    }

    const contestPayload = {
      title: contestData.title,
      description: contestData.description,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      isPublic: contestData.isPublic,
      QuestionSet: [],
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${Baseurl}/post/createcontest`,
        contestPayload,
        {
          withCredentials: true,
          headers: {
            "x-user-id": localStorage.getItem("userId1"),
          },
        }
      );
      const newContest = response?.data.contest;
      console.log("New contest created:", newContest);

      setContests([...contests, newContest]);

      // Reset the contest form
      setContestData({
        title: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        isPublic: false, // Default to private
      });

      toast.success("Contest created successfully!");
    } catch (error) {
      console.error("Error creating contest:", error);
      toast.error(error?.response?.data?.message || "Failed to create contest. Please try again.");
      navigate("/login"); // Redirect to login if unauthorized
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Toggle contest visibility
  const toggleContestVisibility = async (contestId, currentStatus) => {
    console.log("s", currentStatus);
    try {
      await axios.post(
        `${Baseurl}/post/makepublic`,
        { isPublic: !currentStatus, contestId },
        { withCredentials: true }
      );

      // Update the local state
      setContests(
        contests.map((contest) =>
          (contest.id || contest._id) === contestId
            ? { ...contest, isPublic: !currentStatus }
            : contest
        )
      );

      toast.success(`Contest is now ${!currentStatus ? "public" : "private"}`);
    } catch (error) {
      console.error("Error updating contest visibility:", error);
      toast.error("Failed to update contest visibility. Please try again.");
    }
  };

  // Handle adding questions - opens the modal
  const handleAddQuestion = (contestId) => {
    setSelectedContestId(contestId);
    setIsQuestionModalOpen(true);
  };

  // Close question form modal
  const closeQuestionForm = () => {
    setSelectedContestId(null);
    setIsQuestionModalOpen(false);
    fetchContests(); // Refresh contests to see updated question count
  };

  // Handle question form completion
  const handleQuestionComplete = () => {
    closeQuestionForm();
  };

  // Handle AI question completion
  const handleAiQuestionComplete = () => {
    handleCloseAiModal();
    fetchContests(); // Refresh contests to see updated question count
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-8 shadow-xl mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Contest Creation Hub
          </h1>
          <p className="text-purple-100">
            Create and manage programming contests for your community
          </p>
        </div>

        {/* Contest Creation Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10 border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-indigo-800">
              Create a New Contest
            </h2>
            <p className="text-gray-600 text-sm">
              Fill in the details to set up your programming challenge
            </p>
          </div>

          <form onSubmit={createContest} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  className="block text-gray-700 text-sm font-semibold"
                  htmlFor="title"
                >
                  Contest Title
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g., Algorithmic Challenge 2023"
                  value={contestData.title}
                  onChange={handleContestChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-gray-700 text-sm font-semibold"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  id="description"
                  name="description"
                  rows="2"
                  placeholder="Describe what this contest is about..."
                  value={contestData.description}
                  onChange={handleContestChange}
                  required
                />
              </div>

              {/* Start Date and Time */}
              <div className="space-y-2">
                <label
                  className="block text-gray-700 text-sm font-semibold"
                  htmlFor="startDate"
                >
                  Start Date
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={contestData.startDate}
                  onChange={handleContestChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-gray-700 text-sm font-semibold"
                  htmlFor="startTime"
                >
                  Start Time
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  id="startTime"
                  type="time"
                  name="startTime"
                  value={contestData.startTime}
                  onChange={handleContestChange}
                  required
                />
              </div>

              {/* End Date and Time */}
              <div className="space-y-2">
                <label
                  className="block text-gray-700 text-sm font-semibold"
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={contestData.endDate}
                  onChange={handleContestChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-gray-700 text-sm font-semibold"
                  htmlFor="endTime"
                >
                  End Time
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  id="endTime"
                  type="time"
                  name="endTime"
                  value={contestData.endTime}
                  onChange={handleContestChange}
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                } text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </div>
                ) : (
                  "Create Contest"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Contests List Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-indigo-800">Your Contests</h2>
            <p className="text-gray-600 text-sm">
              Manage and add questions to your created contests
            </p>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <svg
                  className="animate-spin h-10 w-10 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : contests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map((contest) => (
                  <div
                    key={contest.id || contest._id}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className={`h-2 ${
                        contest.isPublic ? "bg-green-600" : "bg-gray-600"
                      }`}
                    ></div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-xl text-gray-800 line-clamp-1">
                          {contest.title}
                        </h3>
                        {/* for view question */}
                        <span className=" py-1 px-2 bg-gray-100 text-black-800 text-xs rounded-full cursor-pointer hover:bg-green-200 transition-colors flex items-center" onClick={() => navigate(`/questionview/${contest.id || contest._id}`)}>
                          View Questions
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full hover:cursor-pointer hover:bg-gray-200 transition-colors ${
                            contest.isPublic
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                          onClick={() =>
                            toggleContestVisibility(
                              contest.id || contest._id,
                              contest.isPublic
                            )
                          }
                        >
                          {contest.isPublic ? "Public" : "Private"}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2 h-12">
                        {contest.description}
                      </p>

                      <div className="space-y-1 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          <span>Start: {formatDate(contest.startDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          <span>End: {formatDate(contest.endDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm">
                          <svg
                            className="w-5 h-5 mr-1 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <span className="font-medium">
                            {contest.QuestionSet?.length || 0} Questions
                          </span>
                        </div>
                      </div>

                      <div className="flex mt-4 space-x-2">
                        <button
                          onClick={() => handleOpenAiModal(contest.id || contest._id)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center group"
                        >
                          <svg
                            className="w-4 h-4 mr-2 transition-transform group-hover:scale-110"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          <span className="relative">
                            Add Question Using AI
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            handleAddQuestion(contest.id || contest._id)
                          }
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors shadow-md flex items-center justify-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                          Add Questions
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No contests created yet
                </h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  Get started by creating your first contest using the form
                  above. Once created, you can add questions to your contest.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Question Form Modal */}
        <Modal isOpen={isQuestionModalOpen} onClose={closeQuestionForm}>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 -m-6 mb-6 rounded-t-xl border-b border-gray-200">
            <h2 className="text-xl font-bold text-blue-800">Add Question</h2>
            <p className="text-gray-600 text-sm">
              Create a multiple choice question for your contest
            </p>
          </div>
          {selectedContestId && (
            <QuestionForm
              contestId={selectedContestId}
              onComplete={handleQuestionComplete}
            />
          )}
        </Modal>

        {/* AI Generated Question Modal - Moved outside the contest cards loop */}
        {selectedAiContestId && (
          <AigeneratedQuestion
            isOpen={aiModalOpen}
            onClose={handleCloseAiModal}
            contestId={selectedAiContestId}
            onSave={handleAiQuestionComplete}
          />
        )}

        <ToastContainer theme="colored" />
      </div>
    </>
  );
};

export default ContestCreation;