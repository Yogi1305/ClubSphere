import React, { useState, useEffect } from 'react';
import { Clock, Users, Building2, Vote, CheckCircle, BarChart3, Calendar, Timer } from 'lucide-react';

export default function PollDisplay() {

  const [pollData, setPollData] = useState({
    _id: "poll123",
    Title: "What's your favorite programming language for web development?",
    Organization: "Tech Solutions Inc",
    Optionsize: 4,
    Participate: [
      { name: "JavaScript", count: ["user1", "user2", "user3", "user4", "user5"] },
      { name: "Python", count: ["user6", "user7", "user8"] },
      { name: "TypeScript", count: ["user9", "user10", "user11", "user12", "user13", "user14", "user15"] },
      { name: "Go", count: ["user16", "user17"] }
    ],
    Totalvoter: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10", "user11", "user12", "user13", "user14", "user15", "user16", "user17"],
    Starttime: new Date('2024-06-20T10:00:00'),
    Endtime: new Date('2024-06-30T18:00:00'),
    createdAt: new Date('2024-06-20T09:00:00'),
    updatedAt: new Date('2024-06-26T14:30:00')
  });

  const [selectedOption, setSelectedOption] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentUser] = useState('currentUser123'); // Mock current user

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if current user has already voted
  useEffect(() => {
    setHasVoted(pollData.Totalvoter.includes(currentUser));
  }, [pollData.Totalvoter, currentUser]);

  const isPollActive = () => {
    return currentTime >= new Date(pollData.Starttime) && currentTime <= new Date(pollData.Endtime);
  };

  const isPollEnded = () => {
    return currentTime > new Date(pollData.Endtime);
  };

  const isPollNotStarted = () => {
    return currentTime < new Date(pollData.Starttime);
  };

  const handleVote = () => {
    if (!selectedOption || hasVoted || !isPollActive()) return;

    // Update poll data with the vote
    setPollData(prev => {
      const updatedParticipate = prev.Participate.map(option => {
        if (option.name === selectedOption) {
          return {
            ...option,
            count: [...option.count, currentUser]
          };
        }
        return option;
      });

      return {
        ...prev,
        Participate: updatedParticipate,
        Totalvoter: [...prev.Totalvoter, currentUser]
      };
    });

    setHasVoted(true);
    setSelectedOption('');
  };

  const getTotalVotes = () => {
    return pollData.Totalvoter.length;
  };

  const getPercentage = (optionCount) => {
    const total = getTotalVotes();
    return total > 0 ? Math.round((optionCount / total) * 100) : 0;
  };

  const getTimeRemaining = () => {
    if (isPollNotStarted()) {
      const diff = new Date(pollData.Starttime) - currentTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `Starts in ${hours}h ${minutes}m`;
    }
    
    if (isPollActive()) {
      const diff = new Date(pollData.Endtime) - currentTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m remaining`;
    }
    
    return 'Poll ended';
  };

  const getStatusColor = () => {
    if (isPollNotStarted()) return 'text-yellow-600 bg-yellow-100';
    if (isPollActive()) return 'text-green-600 bg-green-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusText = () => {
    if (isPollNotStarted()) return 'Not Started';
    if (isPollActive()) return 'Active';
    return 'Ended';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <Vote className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">{pollData.Title}</h1>
                  <div className="flex items-center text-white/80">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span>{pollData.Organization}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                  <Timer className="w-4 h-4 mr-1" />
                  {getStatusText()}
                </div>
                <p className="text-white/80 text-sm mt-1">{getTimeRemaining()}</p>
              </div>
            </div>
          </div>

          {/* Poll Content */}
          <div className="p-6">
            {/* Time Information */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">Start Time</span>
                </div>
                <p className="text-gray-800">{new Date(pollData.Starttime).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">End Time</span>
                </div>
                <p className="text-gray-800">{new Date(pollData.Endtime).toLocaleString()}</p>
              </div>
            </div>

            {/* Voting Section */}
            {isPollActive() && !hasVoted && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Cast Your Vote</h3>
                <div className="space-y-3">
                  {pollData.Participate.map((option, index) => (
                    <label key={index} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="pollOption"
                        value={option.name}
                        checked={selectedOption === option.name}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-800 font-medium">{option.name}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleVote}
                  disabled={!selectedOption}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Vote className="w-5 h-5 inline mr-2" />
                  Submit Vote
                </button>
              </div>
            )}

            {/* Already Voted Message */}
            {isPollActive() && hasVoted && (
              <div className="mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Thank you for voting!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">Your vote has been recorded successfully.</p>
                </div>
              </div>
            )}

            {/* Poll Not Started Message */}
            {isPollNotStarted() && (
              <div className="mb-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Timer className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">Poll hasn't started yet</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">Please wait until the start time to cast your vote.</p>
                </div>
              </div>
            )}

            {/* Results Section */}
            {(isPollEnded() || hasVoted) && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    <BarChart3 className="w-6 h-6 inline mr-2" />
                    Poll Results
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="font-medium">{getTotalVotes()} total votes</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {pollData.Participate
                    .sort((a, b) => b.count.length - a.count.length)
                    .map((option, index) => {
                      const percentage = getPercentage(option.count.length);
                      return (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{option.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600">{option.count.length} votes</span>
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          {isPollEnded() && (
                            <div className="mt-2 text-xs text-gray-500">
                              Individual votes: {option.count.length > 0 ? option.count.join(', ') : 'No votes'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Vote Button (Disabled when poll hasn't started) */}
            {isPollNotStarted() && !hasVoted && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Poll Options</h3>
                <div className="space-y-3">
                  {pollData.Participate.map((option, index) => (
                    <div key={index} className="flex items-center p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                      <input
                        type="radio"
                        disabled
                        className="w-4 h-4 text-gray-400"
                      />
                      <span className="ml-3 text-gray-600 font-medium">{option.name}</span>
                    </div>
                  ))}
                </div>
                <button
                  disabled
                  className="mt-4 w-full bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                >
                  <Vote className="w-5 h-5 inline mr-2" />
                  Voting Not Started
                </button>
              </div>
            )}

            {/* Poll Metadata */}
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span> {new Date(pollData.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {new Date(pollData.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}