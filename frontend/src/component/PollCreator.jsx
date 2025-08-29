import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Users,
  Clock,
  Building2,
  Vote,
  Eye,
  ArrowRight,
} from "lucide-react";

import Navbar from "./Navbar";
import axios from "axios";
import { Baseurl } from "../main";
import { toast } from "react-toastify";

const PollDisplay = ({ poll, onBack }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const now = new Date();
  const startTime = new Date(poll.Starttime);
  const endTime = new Date(poll.Endtime);

  const status =
    now < startTime ? "upcoming" : now > endTime ? "ended" : "active";

  const totalVotes = poll.Participate.reduce(
    (sum, option) => sum + (option.count?.length || 0),
    0
  );

  const onVote = async (pollId, index) => {
    try {
      const userId = localStorage.getItem("userId1");
      const res = await axios.post(`${Baseurl}/voting/vote`, {
        pollId,
        index,
        userId,
      });
      // console.log(res);
      toast.success("polling successfully");
    } catch (error) {
      console.log("error in voting", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Polls
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full font-medium">
                  {poll.Organization}
                </span>
                <span
                  className={`ml-3 text-sm px-3 py-1 rounded-full font-medium ${
                    status === "active"
                      ? "bg-green-100 text-green-800"
                      : status === "upcoming"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {poll.Title}
              </h1>
              <div className="flex items-center text-gray-600 space-x-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {startTime.toLocaleString()} - {endTime.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">{totalVotes} votes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Poll Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Poll Options
            </h2>
            {poll.Participate.map((option, index) => {
              const voteCount = option.count?.length || 0;
              const percentage =
                totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

              return (
                <div
                  key={index}
                  onClick={() => status === "active" && setSelectedIndex(index)}
                  className={`border-2 rounded-lg p-4 transition-colors cursor-pointer ${
                    selectedIndex === index
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="poll-option"
                        checked={selectedIndex === index}
                        onChange={() => setSelectedIndex(index)}
                        disabled={status !== "active"}
                        className="mr-3 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-lg font-medium text-gray-800">
                        {option.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-700">
                        {voteCount} votes
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Message */}
          {status === "active" && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                This poll is currently active. You can vote now!
              </p>
            </div>
          )}
          {status === "upcoming" && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">
                This poll hasn't started yet. Check back later!
              </p>
            </div>
          )}
          {status === "ended" && (
            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-800 font-medium">
                This poll has ended. Final results are displayed above.
              </p>
            </div>
          )}

          {/* Vote Button */}
          {status === "active" && selectedIndex !== null && (
            <div className="mt-6 text-right">
              <button
                onClick={() => onVote(poll._id, selectedIndex)}
                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition"
              >
                Vote Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Poll Card Component
const PollCard = ({ poll, onView }) => {
  const getStatus = () => {
    const now = new Date();
    const startTime = new Date(poll.Starttime);
    const endTime = new Date(poll.Endtime);

    if (now < startTime) return "upcoming";
    if (now > endTime) return "ended";
    return "active";
  };

  const status = getStatus();
  const totalVotes = poll.Participate.reduce(
    (sum, option) => sum + (option.count?.length || 0),
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full font-medium">
              {poll.Organization}
            </span>
            <span
              className={`ml-2 text-xs px-2 py-1 rounded-full font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-800"
                  : status === "upcoming"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {status === "active"
                ? "Active"
                : status === "upcoming"
                ? "Upcoming"
                : "Ended"}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {poll.Title}
          </h3>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Starts: {new Date(poll.Starttime).toLocaleDateString()}{" "}
            {new Date(poll.Starttime).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Ends: {new Date(poll.Endtime).toLocaleDateString()}{" "}
            {new Date(poll.Endtime).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {totalVotes} votes • {poll.Optionsize} options
          </span>
        </div>
      </div>

      <button
        onClick={() => onView(poll)}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center"
      >
        <Eye className="w-4 h-4 mr-2" />
        View Poll
      </button>
    </div>
  );
};

const PollCreator = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [pollData, setPollData] = useState({
    title: "",
    organization: "",
    optionSize: 2,
    options: ["", ""],
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState({});
  const [polls, setPolls] = useState([]);

  // Move useEffect to the top with other hooks
  const getdata = async () => {
    try {
      const response = await axios.get(`${Baseurl}/voting/getpolls`);
      setPolls(response.data.recentPolls);
      // console.log(response.data.recentPolls);
    } catch (error) {
      console.log("error in fetching the polls", error);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const handleInputChange = (field, value) => {
    setPollData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const addOption = () => {
    if (pollData.options.length < 10) {
      setPollData((prev) => ({
        ...prev,
        options: [...prev.options, ""],
        optionSize: prev.optionSize + 1,
      }));
    }
  };

  const removeOption = (index) => {
    if (pollData.options.length > 2) {
      const newOptions = pollData.options.filter((_, i) => i !== index);
      setPollData((prev) => ({
        ...prev,
        options: newOptions,
        optionSize: prev.optionSize - 1,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!pollData.title.trim()) {
      newErrors.title = "Poll title is required";
    }

    if (!pollData.organization.trim()) {
      newErrors.organization = "Organization name is required";
    }

    if (!pollData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!pollData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (pollData.startTime && pollData.endTime) {
      if (new Date(pollData.startTime) >= new Date(pollData.endTime)) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    pollData.options.forEach((option, index) => {
      if (!option.trim()) {
        newErrors[`option${index}`] = `Option ${index + 1} cannot be empty`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId1");
    if (validateForm()) {
      const formattedData = {
        Title: pollData.title,
        Organization: pollData.organization,
        Optionsize: pollData.optionSize,
        Participate: pollData.options.map((option) => ({
          name: option,
          count: [],
        })),
        Totalvoter: [],
        Starttime: new Date(pollData.startTime),
        Endtime: new Date(pollData.endTime),
        userId: userId,
      };
      try {
        const res = await axios.post(`${Baseurl}/voting/create`, formattedData);
        if (res.data.success) {
          toast.success("Poll created successfully!");
          // Refresh the polls list
          getdata();
        }
      } catch (error) {
        console.log("fail to create poll", error);
        toast.error(error.response?.data?.message || "Failed to create poll");
      }

      // Reset form and hide it
      setPollData({
        title: "",
        organization: "",
        optionSize: 2,
        options: ["", ""],
        startTime: "",
        endTime: "",
      });
      setShowForm(false);
    }
  };

  const handleCreatePollClick = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setPollData({
      title: "",
      organization: "",
      optionSize: 2,
      options: ["", ""],
      startTime: "",
      endTime: "",
    });
    setErrors({});
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleViewPoll = (poll) => {
    setSelectedPoll(poll);
  };

  const handleBackToPolls = () => {
    setSelectedPoll(null);
  };

  // If viewing a specific poll
  if (selectedPoll) {
    return <PollDisplay poll={selectedPoll} onBack={handleBackToPolls} />;
  }

  // Landing Page View with Poll Cards
  if (!showForm) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          <Navbar />
          {/* <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4"> */}
            <div className="max-w-7xl mx-auto mt-2 ">
              {/* Header Section */}
              <div className="text-center mb-12  ">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6">
                  <Vote className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Poll Creator
                </h1>
                <p className="text-white mb-8 text-lg max-w-2xl mx-auto">
                  Create engaging polls for your organization and gather
                  valuable insights from your audience.
                </p>
                <button
                  onClick={handleCreatePollClick}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create New Poll
                </button>
              </div>

              {/* Polls Grid */}
              {polls.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Available Polls
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {polls.map((poll, index) => (
                      <PollCard
                        key={index}
                        poll={poll}
                        onView={handleViewPoll}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Features Section */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                  <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Easy Setup
                  </h3>
                  <p className="text-gray-600">
                    Create polls in minutes with our intuitive interface
                  </p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                  <Clock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Time Control
                  </h3>
                  <p className="text-gray-600">
                    Set precise start and end times for your polls
                  </p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                  <Building2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Organization
                  </h3>
                  <p className="text-gray-600">
                    Organize polls by departments or teams
                  </p>
                </div>
              </div>
            </div>
          {/* </div> */}
        </div>
      </>
    );
  }


  return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated Background Elements - with pointer-events-none */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 pointer-events-none"></div>
      </div>
      
      {/* Navbar with proper z-index */}
      <div className="relative z-40">
        <Navbar />
      </div>
      
      {/* Form Container with proper z-index */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4 relative z-10">
        <div className="max-w-2xl mx-auto relative z-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 relative z-30">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Create New Poll
                  </h1>
                  <p className="text-gray-600">
                    Design your poll and let people vote!
                  </p>
                </div>
              </div>
              {/* Fixed Cancel Button in Header */}
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative z-40 cursor-pointer"
                style={{ position: 'relative', zIndex: 40 }}
              >
                Cancel
              </button>
            </div>

            {/* Form content here... */}
            <div className="space-y-6">
                {/* Organization */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Organization *
                  </label>
                  <input
                    type="text"
                    value={pollData.organization}
                    onChange={(e) =>
                      handleInputChange("organization", e.target.value)
                    }
                    placeholder="Enter your organization name"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors.organization
                        ? "border-red-500"
                        : "border-gray-200 focus:border-purple-500"
                    }`}
                  />
                  {errors.organization && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.organization}
                    </p>
                  )}
                </div>

                {/* Poll Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Poll Title *
                  </label>
                  <input
                    type="text"
                    value={pollData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="What's your poll question?"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors.title
                        ? "border-red-500"
                        : "border-gray-200 focus:border-purple-500"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Poll Options */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Poll Options ({pollData.optionSize})
                    </label>
                    <button
                      type="button"
                      onClick={addOption}
                      disabled={pollData.options.length >= 10}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </button>
                  </div>

                  <div className="space-y-3">
                    {pollData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                              errors[`option${index}`]
                                ? "border-red-500"
                                : "border-gray-200 focus:border-purple-500"
                            }`}
                          />
                          {errors[`option${index}`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`option${index}`]}
                            </p>
                          )}
                        </div>
                        {pollData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Settings */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={pollData.startTime}
                      onChange={(e) =>
                        handleInputChange("startTime", e.target.value)
                      }
                      min={getCurrentDateTime()}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                        errors.startTime
                          ? "border-red-500"
                          : "border-gray-200 focus:border-purple-500"
                      }`}
                    />
                    {errors.startTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.startTime}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={pollData.endTime}
                      onChange={(e) =>
                        handleInputChange("endTime", e.target.value)
                      }
                      min={pollData.startTime || getCurrentDateTime()}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                        errors.endTime
                          ? "border-red-500"
                          : "border-gray-200 focus:border-purple-500"
                      }`}
                    />
                    {errors.endTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.endTime}
                      </p>
                    )}
                  </div>
                </div>

                
            
              
              {/* Fixed Action Buttons */}
              <div className="flex space-x-4 pt-4 relative z-40">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors relative z-40 cursor-pointer active:bg-gray-400"
                  style={{ position: 'relative', zIndex: 40 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] relative z-40 cursor-pointer"
                  style={{ position: 'relative', zIndex: 40 }}
                >
                  Create Poll
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  </>
);
};

export default PollCreator;
