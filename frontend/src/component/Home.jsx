import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Baseurl } from '../main';
import Navbar from './Navbar';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${Baseurl}/checklogged`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      setIsLoggedIn(response.data?.success || false);
      
      if (response.data?.user?.fullName) {
        setUserName(response.data.user.fullName);
      }
    } catch (error) {
      console.log("Error checking login status:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${Baseurl}/logout`, {
        withCredentials: true
      });
      localStorage.removeItem("userId1");
      setIsLoggedIn(false);
      setUserName('');
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="max-w-5xl relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            <span className="text-purple-200 text-sm font-medium">Live Quiz Platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-6 leading-tight tracking-tight">
            Master Your Mind with{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Quizzy</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transform -skew-x-12"></div>
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Challenge your intellect, compete globally, and unlock your potential with our cutting-edge quiz platform designed for brilliant minds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link 
              to="/contest" 
              className="group relative w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                🚀 Join Live Contests
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </Link>
            
            {!isLoggedIn && (
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-10 py-4 rounded-2xl font-bold hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105"
              >
                ✨ Start Your Journey
              </Link>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">10K+</div>
              <div className="text-sm text-gray-400 font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">50K+</div>
              <div className="text-sm text-gray-400 font-medium">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-2">100+</div>
              <div className="text-sm text-gray-400 font-medium">Categories</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="relative bg-black/30 backdrop-blur-sm py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-4">
              Why Genius Minds Choose Us
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the most advanced quiz platform with features designed to challenge and inspire.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Questions</h3>
                <p className="text-gray-300 leading-relaxed">Our advanced AI curates personalized questions that adapt to your skill level and learning pace.</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
                <p className="text-gray-300 leading-relaxed">Experience real-time competitions with millisecond precision and instant global leaderboards.</p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-sm rounded-3xl p-8 border border-green-500/30 hover:border-green-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Military-Grade Security</h3>
                <p className="text-gray-300 leading-relaxed">Bank-level encryption ensures fair play and protects your data with uncompromising security.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-6">
            Ready to Prove Your Genius?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join the elite community of quiz masters and start your journey to intellectual supremacy.
          </p>
          <Link 
            to="/contest" 
            className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-lg rounded-2xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105"
          >
            🏆 Start Competing Now
            <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative bg-black/50 backdrop-blur-sm border-t border-white/10 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">Quizzy</h3>
              <p className="text-gray-400">Elevating minds through intelligent competition</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-8">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-105">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-105">Terms of Service</a>
              <a href="/contactus" className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-105">Contact Us</a>
              <a href="/refunds" className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-105">Refunds</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500">© 2025 Quizzy. Crafted with 💜 for brilliant minds worldwide.</p>
          </div>
        </div>
      </footer>

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
  );
};

export default Home;