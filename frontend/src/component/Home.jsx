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