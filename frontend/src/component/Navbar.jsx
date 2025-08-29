import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Baseurl } from '../main';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
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
      localStorage.removeItem('userId1');
      localStorage.removeItem('contestid');
      // Clear user ID from local storage
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

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img 
                  src="/126.jpg" 
                  alt="Logo" 
                  className="h-12 w-16 rounded-xl object-cover border-2 border-purple-500/30 group-hover:border-purple-400/60 transition-all duration-300 shadow-lg" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="ml-3">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 group-hover:from-yellow-400 group-hover:via-orange-400 group-hover:to-red-400 transition-all duration-300">
                  Quizzy
                </span>
                <div className="h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link 
                to="/" 
                className="relative px-4 py-2 text-white/80 hover:text-white font-medium transition-all duration-300 group rounded-xl"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/contest" 
                className="relative px-4 py-2 text-white/80 hover:text-white font-medium transition-all duration-300 group rounded-xl"
              >
                <span className="relative z-10">Contests</span>
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/polls" 
                className="relative px-4 py-2 text-white/80 hover:text-white font-medium transition-all duration-300 group rounded-xl"
              >
                <span className="relative z-10">Polls</span>
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
             
              <Link 
                to="/pricing" 
                className="relative px-4 py-2 text-white/80 hover:text-white font-medium transition-all duration-300 group rounded-xl"
              >
                <span className="relative z-10">Pricing</span>
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
               <Link 
                to="/about" 
                className="relative px-4 py-2 text-white/80 hover:text-white font-medium transition-all duration-300 group rounded-xl"
              >
                <span className="relative z-10">About Me</span>
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {loading ? (
                <div className="flex space-x-3">
                  <div className="w-20 h-10 bg-white/10 rounded-xl animate-pulse"></div>
                  <div className="w-24 h-10 bg-white/10 rounded-xl animate-pulse"></div>
                </div>
              ) : isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 backdrop-blur-sm text-white px-5 py-3 rounded-2xl transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 group shadow-lg hover:shadow-purple-500/25"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black/20"></div>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium max-w-[120px] truncate">{userName}</span>
                      <span className="text-xs text-purple-200">Online</span>
                    </div>
                    <svg className={`w-5 h-5 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''} group-hover:text-purple-200`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-64 bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-purple-500/30 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
                      <div className="relative z-10">
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium text-white">{userName}</p>
                          <p className="text-xs text-gray-400">Manage your account</p>
                        </div>
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                        >
                          <svg className="w-4 h-4 mr-3 group-hover:text-purple-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </Link>
                        <Link 
                          to="/my-contests" 
                          className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                        >
                          <svg className="w-4 h-4 mr-3 group-hover:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          My Contests
                        </Link>
                        <div className="border-t border-white/10 my-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                        >
                          <svg className="w-4 h-4 mr-3 group-hover:text-red-300 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="px-6 py-3 text-white font-medium border border-white/30 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 text-white hover:text-purple-200 transition-colors duration-200 rounded-xl hover:bg-white/10"
              >
                <svg className={`h-6 w-6 transition-transform duration-300 ${showMobileMenu ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-white/10 bg-black/30 backdrop-blur-xl">
            <div className="px-4 py-6 space-y-3">
              {/* Mobile Navigation Links */}
              <Link 
                to="/" 
                className="block px-4 py-3 text-white hover:text-purple-200 hover:bg-white/10 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link 
                to="/contest" 
                className="block px-4 py-3 text-white hover:text-purple-200 hover:bg-white/10 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Contests
              </Link>
              <Link 
                to="/polls" 
                className="block px-4 py-3 text-white hover:text-purple-200 hover:bg-white/10 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Polls
              </Link>
              <Link 
                to="/about" 
                className="block px-4 py-3 text-white hover:text-purple-200 hover:bg-white/10 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link 
                to="/pricing" 
                className="block px-4 py-3 text-white hover:text-purple-200 hover:bg-white/10 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Pricing
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="border-t border-white/10 pt-4 mt-4">
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-12 bg-white/10 rounded-xl animate-pulse"></div>
                    <div className="h-12 bg-white/10 rounded-xl animate-pulse"></div>
                  </div>
                ) : isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{userName}</p>
                        <p className="text-purple-200 text-sm">Online</p>
                      </div>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-3 text-white hover:text-purple-200 hover:bg-white/10 rounded-xl transition-all duration-200"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      to="/my-contests" 
                      className="block px-4 py-3 text-white hover:text-purple-200 hover:bg-white/10 rounded-xl transition-all duration-200"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      My Contests
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      to="/login" 
                      className="block w-full text-center px-6 py-3 text-white font-medium border border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Log In
                    </Link>
                    <Link 
                      to="/register" 
                      className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;