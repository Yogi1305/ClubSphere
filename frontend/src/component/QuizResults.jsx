import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Baseurl } from '../main'; // Adjust the import path as needed
import Navbar from './Navbar';

const QuizResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [contestDetails, setContestDetails] = useState(null);

  const contestId  = localStorage.getItem("contestid"); // Assuming you use React Router and have contestId in URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        // Fetch results from API
        const response = await axios.post(
          `${Baseurl}/post/results`, 
          { ContestId: contestId },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
        console.log(response)
        setResults(response.data.results);
        setTotalParticipants(response.totalParticipants);
        
        // Optionally fetch contest details if needed
        try {
          const contestResponse = await axios.get(
            `${Baseurl}/contest/${contestId}`,
            { withCredentials: true }
          );
          setContestDetails(contestResponse.data);
        } catch (err) {
          console.error("Failed to fetch contest details:", err);
          // Non-critical error, don't show to user
        }
        
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(err.response?.data?.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    if (contestId) {
      fetchResults();
    }
  }, [contestId]);

  // Helper function to render rank badges
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full shadow-lg">
            <span className="font-bold">1</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-400 text-white rounded-full shadow-md">
            <span className="font-bold">2</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-amber-700 text-white rounded-full shadow-md">
            <span className="font-bold">3</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-full">
            <span className="font-bold">{rank}</span>
          </div>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Results...</h2>
          <p className="text-gray-500 mt-2">Fetching contest leaderboard</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Error Loading Results</h2>
          <p className="text-red-500 mt-2">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No results state
  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">No Results Found</h2>
          <p className="text-gray-500 mt-2">There are no participants for this contest yet.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
     <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4">
     
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Contest Results</h1>
            {contestDetails && (
              <p className="text-indigo-100 text-lg mb-2">{contestDetails.title}</p>
            )}
            <div className="flex items-center text-sm text-indigo-100">
              <span className="mr-4">
                <span className="font-semibold">{totalParticipants}</span> Participants
              </span>
              {contestDetails && contestDetails.date && (
                <span>
                  <span className="font-semibold">{new Date(contestDetails.date).toLocaleDateString()}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Winners Podium (for top 3) */}
        {results.length >= 2 && (
          <div className="mb-12 flex justify-center items-end space-x-4 h-44">
            {/* Second Place */}
            {results.length >= 2 && (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg mb-2 border-2 border-gray-300">
                  <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
                    {results[1].profileImage ? (
                      <img src={results[1].profileImage} alt="Second place" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xl font-bold">{results[1].fullName?.charAt(0) || '2'}</span>
                    )}
                  </div>
                </div>
                <div className="bg-gray-400 w-24 h-28 rounded-t-lg flex flex-col items-center justify-center text-white p-2">
                  <span className="font-bold text-2xl">2nd</span>
                  <span className="font-medium text-sm truncate w-full text-center">{results[1].fullName}</span>
                  <span className="font-bold">{results[1].correctAnswerCount} pts</span>
                </div>
              </div>
            )}

            {/* First Place */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg mb-2 border-2 border-yellow-500">
                <div className="w-full h-full rounded-full bg-yellow-500 flex items-center justify-center overflow-hidden">
                  {results[0].profileImage ? (
                    <img src={results[0].profileImage} alt="First place" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl font-bold">{results[0].fullName?.charAt(0) || '1'}</span>
                  )}
                </div>
              </div>
              <div className="bg-yellow-500 w-32 h-36 rounded-t-lg flex flex-col items-center justify-center text-white p-2 relative">
                <svg className="absolute -top-5 text-yellow-500 w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-2xl">1st</span>
                <span className="font-medium text-sm truncate w-full text-center">{results[0].fullName}</span>
                <span className="font-bold">{results[0].correctAnswerCount} pts</span>
              </div>
            </div>

            {/* Third Place */}
            {results.length >= 3 && (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg mb-2 border-2 border-amber-700">
                  <div className="w-full h-full rounded-full bg-amber-700 flex items-center justify-center overflow-hidden">
                    {results[2].profileImage ? (
                      <img src={results[2].profileImage} alt="Third place" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xl font-bold">{results[2].fullName?.charAt(0) || '3'}</span>
                    )}
                  </div>
                </div>
                <div className="bg-amber-700 w-24 h-24 rounded-t-lg flex flex-col items-center justify-center text-white p-2">
                  <span className="font-bold text-2xl">3rd</span>
                  <span className="font-medium text-sm truncate w-full text-center">{results[2].fullName}</span>
                  <span className="font-bold">{results[2].correctAnswerCount} pts</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Results Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-indigo-50 border-b border-indigo-100">
            <h2 className="text-xl font-semibold text-indigo-900">Complete Leaderboard</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correct
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wrong
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={result.userId || index} className={index < 3 ? 'bg-indigo-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRankBadge(result.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-bold">
                          {result.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {result.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {result.correctAnswerCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {result.wrongAnswerCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.totalAnswered || (result.correctAnswerCount + (result.wrongAnswerCount || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
          <button 
            onClick={() => navigate('/contest')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            All Contests
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default QuizResults;