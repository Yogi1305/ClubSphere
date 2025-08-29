import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Baseurl } from '../main';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from './Navbar';

const Questionview = () => {
    const { contestId } = useParams();
    const [question, setQuestion] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editData, setEditData] = useState({
        Question: '',
        Options: ['', '', '', ''],
        Answer: ''
    });

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                axios.defaults.withCredentials = true;
                const response = await axios.get(`${Baseurl}/post/${contestId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-user-id": localStorage.getItem("userId1")
                    },
                    withCredentials: true,
                });
                setQuestion(response.data.contest.QuestionSet);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                toast.error('Failed to fetch questions');
            }
        }
        fetchQuestion();
    }, [contestId]);

    const removeQuestionFromContest = async (contestId, questionId) => {
        try {
            const response = await axios.delete(`${Baseurl}/post/${contestId}/${questionId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "x-user-id": localStorage.getItem("userId1")
                },
                withCredentials: true,
            });
            toast.success(response.data.message);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            toast.error('Failed to remove question');
        }
    };

    const startEdit = (q) => {
        setEditingQuestion(q._id);
        setEditData({
            Question: q.Question,
            Options: [...q.Options],
            Answer: q.Answer
        });
    };

    const cancelEdit = () => {
        setEditingQuestion(null);
        setEditData({
            Question: '',
            Options: ['', '', '', ''],
            Answer: ''
        });
    };

    const handleEditChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...editData.Options];
        newOptions[index] = value;
        setEditData(prev => ({
            ...prev,
            Options: newOptions
        }));
    };

    const updateQuestion = async (contestId, questionId) => {
        try {
            const response = await axios.put(`${Baseurl}/post/update/${contestId}/${questionId}`, 
                editData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "x-user-id": localStorage.getItem("userId1")
                    },
                    withCredentials: true,
                }
            );
            toast.success(response.data.message);
            setEditingQuestion(null);
            // Refresh the questions
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error updating question:', error);
            toast.error('Failed to update question');
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <ToastContainer position="top-right" />
              <Navbar/>
            {/* Header */}
            <div className='relative py-16 z-10'>
              
                <div className="text-center mb-8">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-purple-200 text-sm font-medium">Question Management</span>
                    </div>
                    
                    <h1 className='text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-4 leading-tight tracking-tight'>
                        Contest{' '}
                        <span className="relative">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Questions</span>
                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transform -skew-x-12"></div>
                        </span>
                    </h1>
                    <p className='text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed'>
                        Manage and edit your contest questions with precision and style
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className='relative max-w-6xl mx-auto px-4 pb-8 z-10'>
                {question.length === 0 ? (
                    <div className='bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl border border-purple-500/30 p-12 text-center'>
                        <div className='text-6xl mb-6'>📝</div>
                        <h3 className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-4'>No Questions Found</h3>
                        <p className='text-gray-300 text-lg'>This contest doesn't have any questions yet. Create your first question to get started!</p>
                    </div>
                ) : (
                    <div className='grid gap-8'>
                        {question.map((q, index) => (
                            <div key={q._id || index} className='group relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden'>
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className='relative bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 z-10'>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='text-2xl font-black text-white tracking-tight'>
                                            Question <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{index + 1}</span>
                                        </h2>
                                        <div className='flex gap-3'>
                                            {editingQuestion === q._id ? (
                                                <>
                                                    <button 
                                                        className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-green-500/25'
                                                        onClick={() => updateQuestion(contestId, q._id)}
                                                    >
                                                        ✓ Save Changes
                                                    </button>
                                                    <button 
                                                        className='bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg'
                                                        onClick={cancelEdit}
                                                    >
                                                        ✕ Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
                                                        onClick={() => startEdit(q)}
                                                    >
                                                        ✏️ Edit Question
                                                    </button>
                                                    <button 
                                                        className='bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-red-500/25'
                                                        onClick={() => removeQuestionFromContest(contestId, q._id)}
                                                    >
                                                        🗑️ Remove
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className='relative p-8 z-10'>
                                    {editingQuestion === q._id ? (
                                        // Edit Mode
                                        <div className='space-y-8'>
                                            {/* Question Input */}
                                            <div>
                                                <label className='block text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-4'>Question Text</label>
                                                <textarea
                                                    value={editData.Question}
                                                    onChange={(e) => handleEditChange('Question', e.target.value)}
                                                    className='w-full p-6 bg-gradient-to-br from-slate-900/50 to-purple-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl focus:border-purple-400/60 focus:outline-none resize-none text-white placeholder-gray-400 font-medium'
                                                    rows="4"
                                                    placeholder="Enter your brilliant question here..."
                                                />
                                            </div>

                                            {/* Options Input */}
                                            <div>
                                                <label className='block text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-4'>Answer Options</label>
                                                <div className='grid gap-4'>
                                                    {editData.Options.map((option, idx) => (
                                                        <div key={idx} className='flex items-center gap-4'>
                                                            <span className='flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-lg font-black'>
                                                                {String.fromCharCode(65 + idx)}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                                className='flex-1 p-4 bg-gradient-to-br from-slate-900/50 to-purple-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl focus:border-purple-400/60 focus:outline-none text-white placeholder-gray-400 font-medium'
                                                                placeholder={`Option ${String.fromCharCode(65 + idx)} - Your answer choice`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Answer Input */}
                                            <div>
                                                <label className='block text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4'>Correct Answer</label>
                                                <input
                                                    type="text"
                                                    value={editData.Answer}
                                                    onChange={(e) => handleEditChange('Answer', e.target.value)}
                                                    className='w-full p-4 bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm border-2 border-green-500/40 rounded-2xl focus:border-green-400/60 focus:outline-none text-white placeholder-green-300 font-medium'
                                                    placeholder="Enter the correct answer exactly as it appears in options..."
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <div className='space-y-8'>
                                            {/* Question Display */}
                                            <div>
                                                <h3 className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 leading-relaxed mb-2'>
                                                    {q.Question}
                                                </h3>
                                            </div>

                                            {/* Options Display */}
                                            <div>
                                                <h4 className='text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 mb-6'>Answer Options:</h4>
                                                <div className='grid gap-4'>
                                                    {q.Options.map((option, idx) => (
                                                        <div key={idx} className='flex items-center gap-4 p-4 bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02]'>
                                                            <span className='flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-lg font-black'>
                                                                {String.fromCharCode(65 + idx)}
                                                            </span>
                                                            <span className='text-white font-medium text-lg'>{option}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Correct Answer Display */}
                                            <div className='bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm border-2 border-green-500/40 rounded-2xl p-6'>
                                                <div className='flex items-center gap-3'>
                                                    <span className='text-2xl'>✅</span>
                                                    <span className='text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400'>Correct Answer:</span>
                                                    <span className='text-xl font-bold text-white'>{q.Answer}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}

export default Questionview