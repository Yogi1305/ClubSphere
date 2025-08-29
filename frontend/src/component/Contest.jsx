import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Baseurl } from "../main";
import Navbar from "./Navbar";

// Custom Logo Component
const QuizLogo = () => (
  <div className="flex items-center">
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
    >
      <rect width="40" height="40" rx="8" fill="#6366F1" />
      <path
        d="M14 11C14 10.4477 14.4477 10 15 10H25C25.5523 10 26 10.4477 26 11V29C26 29.5523 25.5523 30 25 30H15C14.4477 30 14 29.5523 14 29V11Z"
        fill="white"
      />
      <path
        d="M17 15C17 14.4477 17.4477 14 18 14H22C22.5523 14 23 14.4477 23 15V17C23 17.5523 22.5523 18 22 18H18C17.4477 18 17 17.5523 17 17V15Z"
        fill="#6366F1"
      />
      <circle cx="20" cy="22" r="2" fill="#6366F1" />
      <path
        d="M17 26C17 25.4477 17.4477 25 18 25H22C22.5523 25 23 25.4477 23 26C23 26.5523 22.5523 27 22 27H18C17.4477 27 17 26.5523 17 26Z"
        fill="#6366F1"
      />
    </svg>
  </div>
);

const Contest = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [reditores, setreditores] = useState(false);
  const navigate = useNavigate();

  // Check if user is admin
  const checkAdminStatus = async () => {
    const UserId = localStorage.getItem("userId1");
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${Baseurl}/isadmin`, {
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": UserId,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.log("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  const getContests = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${Baseurl}/post/getallcontest`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = response?.data?.contests?.filter(
        (contest) => contest.isPublic === true
      );
      // console.log(data);
      setContests(data || []);
      // console.log(response?.data)
    } catch (error) {
      console.log("Error in contest page frontend", error);
      toast.error("Failed to load contests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContests();
    checkAdminStatus(); // Check admin status when component mounts
  }, []);

  const handleJoinContest = async (contestId, contest) => {
    try {
      // console.log(contestId);
      const userId = localStorage.getItem("userId1");
      const response = await axios.post(
        `${Baseurl}/complete`,
        { contestId, userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(`Joining ${contest.title}`);
      localStorage.setItem("contestid", contestId);
      //   console.log("hi",response)
      if (response.data.success) navigate("/result");
      else navigate("/ContestQuestion");
    } catch (error) {
      console.log("Error while navigating to ContestQuestion:", error.response);
      toast.error("Failed to join contest. Please try again.");
    }
  };

  const handleCreateContest = () => {
    navigate("/createcontest"); // Navigate to create contest page
  };

  // Filter contests based on active filter
  const filteredContests = contests.filter((contest) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "upcoming") {
      // Example filtering logic - adjust based on your data structure
      return new Date(contest.startTime) > new Date();
    }
    if (activeFilter === "active") {
      // Example filtering logic - adjust based on your data structure
      const now = new Date();
      return (
        new Date(contest.startTime) <= now &&
        (!contest.endTime || new Date(contest.endTime) >= now)
      );
    }
    if (activeFilter === "completed") {
      // Example filtering logic - adjust based on your data structure
      return contest.endTime && new Date(contest.endTime) < new Date();
    }
    return true;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    // <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500">
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold text-white mb-4">
            Available Contests
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Challenge yourself with our curated collection of quizzes and
            compete with others.
          </p>

          {/* Admin Create Contest Button */}
          {
            <div className="mt-6">
              <button
                onClick={handleCreateContest}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-lg transition-colors duration-300 flex items-center mx-auto"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create New Contest
              </button>
            </div>
          }
        </div>

        {/* Filters */}
        <div className="mb-8 flex justify-center">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-white text-indigo-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              All Contests
            </button>
            <button
              onClick={() => setActiveFilter("upcoming")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "upcoming"
                  ? "bg-white text-indigo-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveFilter("active")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "active"
                  ? "bg-white text-indigo-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "completed"
                  ? "bg-white text-indigo-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {/* No Contests Found */}
        {!loading && filteredContests.length === 0 && (
          <div className="text-center py-16 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20">
            <svg
              className="mx-auto h-12 w-12 text-indigo-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-white">
              No contests found
            </h3>
            <p className="mt-1 text-indigo-200">
              No contests are currently available in this category.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setActiveFilter("all");
                  getContests();
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Refresh Contests
              </button>
            </div>
          </div>
        )}

        {/* Contest Cards */}
        {!loading && filteredContests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest) => (
              <div
                key={contest._id}
                className="backdrop-blur-sm bg-white/10 rounded-xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]"
              >
                <div className="h-3 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {contest.title}
                    </h3>
                    <span className="px-2 py-1 bg-indigo-600 text-xs font-semibold text-white rounded-full">
                      {contest.QuestionSet?.length || 0} Questions
                    </span>
                  </div>

                  <p className="text-indigo-100 mb-4 line-clamp-2">
                    {contest.description ||
                      "Join this exciting quiz contest to test your knowledge."}
                  </p>

                  <div className="mb-4 space-y-2">
                    {contest.startDate && (
                      <div className="flex items-center text-sm text-indigo-200">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-semibold">
                          Starts: {formatDate(contest.startDate)}
                        
                        </span>
                        <br/>
                        <br/>
                        <span className="font-semibold">
                          
                          End: {formatDate(contest.endDate)}
                        </span>
                      </div>
                    )}

                    {contest.startDate && contest.endDate && (
                      <div className="flex items-center text-sm text-indigo-200">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-white font-semibold">
                          Duration:{" "}
                          {(
                            (new Date(contest.endDate) -
                              new Date(contest.startDate)) /
                            (1000 * 60)
                          ).toFixed(0)}{" "}
                          minutes
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleJoinContest(contest._id, contest)}
                    className="w-full bg-white text-indigo-600 font-medium py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300 flex items-center justify-center"
                    disabled={new Date(contest.startDate) > new Date()}
                  >
                    <span
                      className={`w-full font-semibold ${
                        new Date(contest.startDate) > new Date()
                          ? "hover:cursor-not-allowed"
                          : "hover:cursor-pointer"
                      }`}
                    >
                      Join Contest
                    </span>
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {!loading && filteredContests.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={getContests}
              className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-300 flex items-center mx-auto"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Contests
            </button>
          </div>
        )}
      </div>

      <ToastContainer theme="colored" />
    </div>
  );
};

export default Contest;
