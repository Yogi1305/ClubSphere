
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Baseurl } from '../../main';

const Clubdetails = ({ club }) => {
    const [clubDetails, setClubDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClubDetails();
    }, []);

    const fetchClubDetails = async () => {
        try {
            const response = await axios.get(`${Baseurl}/member/postholders/${club}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            console.log('Club details response:', response.data.data);
            setClubDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching club details:', error);
        } finally {
            setLoading(false);
        }
    };

    // Compact loading component
    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="relative">
                    {/* Outer ring */}
                    <div className="w-12 h-12 border-3 border-blue-200 rounded-full animate-spin"></div>
                    {/* Inner ring */}
                    <div className="absolute top-1.5 left-1.5 w-9 h-9 border-3 border-purple-400 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
                    {/* Center dot */}
                    <div className="absolute top-4.5 left-4.5 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                </div>
            </div>
        );
    }

    // Generate a dynamic gradient based on the user's name
    const getGradient = (name) => {
        const gradients = [
            'from-blue-500 to-purple-600',
            'from-emerald-500 to-teal-600',
            'from-pink-500 to-rose-600',
            'from-orange-500 to-red-600',
            'from-cyan-500 to-blue-600',
            'from-violet-500 to-purple-600',
            'from-yellow-500 to-orange-600',
            'from-green-500 to-emerald-600',
        ];
        const hash = name?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
        return gradients[hash % gradients.length];
    };

    return (
        <div className="w-full">
            {/* Compact header */}
            <div className="text-center mb-6">
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full animate-expand mb-4"></div>
            </div>

            {clubDetails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 animate-fade-in">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No post holders found</p>
                    <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {clubDetails.map((holder, index) => (
                        <div
                            key={holder.id}
                            className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-2 transition-all duration-400 p-4 cursor-pointer border border-gray-100 animate-slide-up overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Animated background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                            
                            {/* Floating particles effect */}
                            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-float"></div>
                            <div className="absolute top-6 right-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-float animation-delay-300"></div>
                            <div className="absolute top-4 right-8 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-float animation-delay-500"></div>

                            <div className="relative flex flex-col items-center text-center">
                                {/* Compact avatar */}
                                <div className="relative mb-4">
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getGradient(holder.UserId.fullName)} flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:scale-105 transition-all duration-300`}>
                                        {holder.UserId.fullName?.charAt(0)}
                                        {/* Subtle pulsing ring */}
                                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 group-hover:animate-pulse"></div>
                                    </div>
                                    {/* Smaller status indicator */}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm">
                                    </div>
                                </div>

                                {/* Compact text */}
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                    {holder.UserId.fullName}
                                </h3>
                                
                                {/* Compact role badge */}
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium border border-blue-100 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                    {holder.Role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add custom styles */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes expand {
                    from { width: 0; }
                    to { width: 6rem; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(180deg); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out both;
                }
                
                .animate-expand {
                    animation: expand 1s ease-out 0.5s both;
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .animation-delay-150 {
                    animation-delay: 150ms;
                }
                
                .animation-delay-300 {
                    animation-delay: 300ms;
                }
                
                .animation-delay-500 {
                    animation-delay: 500ms;
                }
            `}</style>
        </div>
    );
};

export default Clubdetails;