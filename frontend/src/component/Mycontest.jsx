import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Baseurl } from '../main';

const Mycontest = () => {
    const[contests, setContests] = useState([]);
    const[loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchContests = async () => {
            try {
                setLoading(true);
                axios.defaults.withCredentials = true;
                const response = await axios.get(`${Baseurl}/contest/my-contests`, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  withCredentials: true,
                });
                setContests(response.data);
                console.log("Contests fetched:", response);
            } catch (error) {
                console.error("Error fetching contests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getContestStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
        if (now > end) return { status: 'ended', color: 'bg-gray-100 text-gray-800' };
        return { status: 'active', color: 'bg-green-100 text-green-800' };
    };

    return (
        <div className='min-h-screen bg-gray-50 py-8 px-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>My Contests</h1>
                    <p className='text-gray-600'>Manage and track your contest participation</p>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center py-12'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                        <p className='ml-4 text-lg text-gray-600'>Loading contests...</p>
                    </div>
                ) : contests.length === 0 ? (
                    <div className='text-center py-12'>
                        <div className='text-gray-400 text-6xl mb-4'>📋</div>
                        <h3 className='text-xl font-semibold text-gray-700 mb-2'>No contests found</h3>
                        <p className='text-gray-500'>You haven't participated in any contests yet.</p>
                    </div>
                ) : (
                    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                        {contests.map((contest) => {
                            const { status, color } = getContestStatus(contest.startDate, contest.endDate);
                            
                            return (
                                <div key={contest._id} className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
                                    <div className='p-6'>
                                        <div className='flex justify-between items-start mb-4'>
                                            <h3 className='text-xl font-semibold text-gray-900 line-clamp-2'>
                                                {contest.title}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${color}`}>
                                                {status}
                                            </span>
                                        </div>
                                        
                                        <p className='text-gray-600 mb-4 line-clamp-3'>
                                            {contest.description}
                                        </p>
                                        
                                        <div className='space-y-2'>
                                            <div className='flex items-center text-sm text-gray-500'>
                                                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                                </svg>
                                                <span>Start: {formatDate(contest.startDate)}</span>
                                            </div>
                                            
                                            <div className='flex items-center text-sm text-gray-500'>
                                                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                                </svg>
                                                <span>End: {formatDate(contest.endDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className='bg-gray-50 px-6 py-3'>
                                        <button className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200'>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mycontest;