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
  const [contestStatuses, setContestStatuses] = useState({}); // Track contest completion status
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

  // Check contest completion status for each contest
  const checkContestStatuses = async (contestList) => {
    const userId = localStorage.getItem("userId1");
    const statusPromises = contestList.map(async (contest) => {
      try {
        const response = await axios.post(
          `${Baseurl}/checkcomplete`,
          { contestId: contest._id, userId },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        // console.log("hi response",response.data.success)
        return {
          
          isCompleted: response.data.success,
          response: response.data
        };
      } catch (error) {
        console.log(`Error checking status for contest ${contest._id}:`, error);
        return {
          contestId: contest._id,
          isCompleted: false,
          response: null
        };
      }
    });

    const statuses = await Promise.all(statusPromises);
    const statusMap = {};
    statuses.forEach(status => {
      statusMap[status.contestId] = status;
    });
    setContestStatuses(statusMap);
  };

  // Get all contests
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
      setContests(data || []);
      
      // Check contest completion status for all contests
      if (data && data.length > 0) {
        await checkContestStatuses(data);
      }
    } catch (error) {
      console.log("Error in contest page frontend", error);
      toast.error("Failed to load contests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContests();
    checkAdminStatus();
  }, []);

  // Get contest overall status (based on time)
  const getContestStatus = (contest) => {
    const now = new Date();
    const startDate = new Date(contest.startDate);
    const endDate = contest.endDate ? new Date(contest.endDate) : null;
    
    if (startDate > now) {
      return 'upcoming';
    } else if (endDate && endDate < now) {
      return 'ended';
    } else {
      return 'active';
    }
  };

  // Get user's participation status for a contest
  const getUserStatus = (contestId) => {
    const contestStatus = contestStatuses[contestId];
    return contestStatus && contestStatus.isCompleted ? 'completed' : 'not_participated';
  };

  // Determine button state and text based on contest timing and user status
  const getButtonState = (contest) => {
    const contestStatus = getContestStatus(contest);
    const userStatus = getUserStatus(contest._id);
    
    switch (contestStatus) {
      case 'upcoming':
        return {
          type: 'not_started',
          text: 'Contest Not Started',
          disabled: true,
          className: 'bg-gray-400 text-white cursor-not-allowed',
          icon: 'clock'
        };
      
      case 'ended':
        return {
          type: 'view_result',
          text: 'View Results',
          disabled: false,
          className: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: 'chart'
        };
      
      case 'active':
        if (userStatus === 'completed') {
          return {
            type: 'completed_waiting',
            text: 'Completed - Wait for Results',
            disabled: true,
            className: 'bg-green-600 text-white cursor-not-allowed',
            icon: 'check'
          };
        } else {
          return {
            type: 'join',
            text: 'Join Contest',
            disabled: false,
            className: 'bg-indigo-600 hover:bg-indigo-700 text-white',
            icon: 'play'
          };
        }
      
      default:
        return {
          type: 'disabled',
          text: 'Unavailable',
          disabled: true,
          className: 'bg-gray-400 text-white cursor-not-allowed',
          icon: 'x'
        };
    }
  };

  // Get status badge for display
  const getStatusBadge = (contest) => {
    const contestStatus = getContestStatus(contest);
    const userStatus = getUserStatus(contest._id);
    
    switch (contestStatus) {
      case 'upcoming':
        return { 
          text: 'Upcoming', 
          className: 'bg-orange-500 text-white' 
        };
      
      case 'ended':
        return { 
          text: 'Ended', 
          className: 'bg-gray-500 text-white' 
        };
      
      case 'active':
        if (userStatus === 'completed') {
          return { 
            text: 'Active (Completed)', 
            className: 'bg-blue-500 text-white' 
          };
        } else {
          return { 
            text: 'Active', 
            className: 'bg-green-500 text-white' 
          };
        }
      
      default:
        return { 
          text: 'Unknown', 
          className: 'bg-gray-400 text-white' 
        };
    }
  };

  // Handle joining a contest
  const handleJoinContest = async (contestId, contest) => {
    try {
      const userId = localStorage.getItem("userId1");
      
      // Double-check contest timing before joining
      const contestStatus = getContestStatus(contest);
      if (contestStatus !== 'active') {
        toast.error("Contest is not currently active!");
        return;
      }

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
      console.log("Join contest response:", response);
      
      // Navigate based on response - if already completed, go to results
      if (response.data.success) {
        navigate("/result");
      } else {
        navigate("/ContestQuestion");
      }
    } catch (error) {
      console.log("Error while joining contest:", error.response);
      toast.error("Failed to join contest. Please try again.");
    }
  };

  // Handle viewing results
  const handleViewResult = async (contestId, contest) => {
    try {
      const contestStatus = getContestStatus(contest);
      if (contestStatus !== 'ended') {
        toast.warning("Results are only available after the contest ends!");
        return;
      }

      toast.success(`Viewing results for ${contest.title}`);
      localStorage.setItem("contestid", contestId);
      navigate("/result");
    } catch (error) {
      console.log("Error while navigating to result:", error);
      toast.error("Failed to view results. Please try again.");
    }
  };

  // Handle button clicks based on button state
  const handleButtonClick = (contest, buttonState) => {
    if (buttonState.disabled) return;
    
    switch (buttonState.type) {
      case 'join':
        handleJoinContest(contest._id, contest);
        break;
      case 'view_result':
        handleViewResult(contest._id, contest);
        break;
      default:
        break;
    }
  };

  const handleCreateContest = () => {
    navigate("/createcontest");
  };

  // Filter contests based on active filter
  const filteredContests = contests.filter((contest) => {
    if (activeFilter === "all") return true;
    
    const contestStatus = getContestStatus(contest);
    
    if (activeFilter === "upcoming") {
      return contestStatus === 'upcoming';
    }
    if (activeFilter === "active") {
      return contestStatus === 'active';
    }
    if (activeFilter === "completed") {
      return contestStatus === 'ended';
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

  // Get icon for button
  const getButtonIcon = (iconType) => {
    const iconClasses = "w-5 h-5 mr-2";
    
    switch (iconType) {
      case 'play':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'check':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  return (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContests.map((contest) => {
              const buttonState = getButtonState(contest);
              const statusBadge = getStatusBadge(contest);
              
              return (
                <div
                  key={contest._id}
                  className="group relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-200/50"
                >
                  {/* Status Badge */}
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${statusBadge.className}`}>
                      {statusBadge.text}
                    </div>
                  </div>

                  {/* Header with gradient */}
                  <div className="relative h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-t-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative h-full flex items-center justify-between px-6">
                      <div className="text-white/90 text-sm font-medium">
                        Contest #{contest._id.slice(-6).toUpperCase()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Title and Question Count */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {contest.title}
                        </h3>
                        <div className="flex items-center space-x-1 bg-indigo-50 px-3 py-1 rounded-full">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-semibold text-indigo-600">
                            {contest.QuestionSet?.length || 0}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {contest.description || "Join this exciting quiz contest to test your knowledge and compete with others."}
                      </p>
                    </div>

                    {/* Contest Details */}
                    <div className="space-y-4 mb-8">
                      {/* Start and End Times */}
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        {contest.startDate && (
                          <div className="flex items-center text-sm">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">Starts</div>
                              <div className="text-gray-600">{formatDate(contest.startDate)}</div>
                            </div>
                          </div>
                        )}
                        
                        {contest.endDate && (
                          <div className="flex items-center text-sm">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">Ends</div>
                              <div className="text-gray-600">{formatDate(contest.endDate)}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleButtonClick(contest, buttonState)}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center shadow-lg ${
                        buttonState.disabled 
                          ? `${buttonState.className} shadow-none cursor-not-allowed` 
                          : `${buttonState.className} hover:shadow-xl transform hover:translate-y-[-2px]`
                      }`}
                      disabled={buttonState.disabled}
                    >
                      <span className="flex items-center">
                        {getButtonIcon(buttonState.icon)}
                        {buttonState.text}
                      </span>
                      {!buttonState.disabled && (
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
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