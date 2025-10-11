import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, Link } from "react-router-dom";
import { Baseurl } from "../main";
import { useEffect } from "react";
// import sw from "../../public/sw"

// Custom Logo Component
const QuizLogo = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <rect width="60" height="60" rx="12" fill="url(#gradient1)" />
        <path
          d="M21 16.5C21 15.6716 21.6716 15 22.5 15H37.5C38.3284 15 39 15.6716 39 16.5V43.5C39 44.3284 38.3284 45 37.5 45H22.5C21.6716 45 21 44.3284 21 43.5V16.5Z"
          fill="white"
        />
        <path
          d="M25.5 22.5C25.5 21.6716 26.1716 21 27 21H33C33.8284 21 34.5 21.6716 34.5 22.5V25.5C34.5 26.3284 33.8284 27 33 27H27C26.1716 27 25.5 26.3284 25.5 25.5V22.5Z"
          fill="url(#gradient2)"
        />
        <circle cx="30" cy="33" r="3" fill="url(#gradient2)" />
        <path
          d="M25.5 39C25.5 38.1716 26.1716 37.5 27 37.5H33C33.8284 37.5 34.5 38.1716 34.5 39C34.5 39.8284 33.8284 40.5 33 40.5H27C26.1716 40.5 25.5 39.8284 25.5 39Z"
          fill="url(#gradient2)"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl opacity-20 blur-xl"></div>
    </div>
    <span className="text-white font-black text-3xl ml-4 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
      ClubSphere
    </span>
  </div>
);

//  this to convert url

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    passWord: "",
    pushsubscription: {},
  });

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const register = await navigator.serviceWorker.register("/sw.js");
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BJRPbFN2VWjkuh9KTHhszRRZU90uKPxCNzRWt2-xygT18bajnRujragK1IVTox3XXr3n_48AGhPaz4qSDmfPc8k"
        ),
      });
      setFormData({ ...formData, pushsubscription: subscription });
      console.log(subscription);
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${Baseurl}/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      localStorage.setItem("userId1", response?.data?._id);
      // console.log('Login successful:', response.data);
      toast.success("Login successful");
      setRedirect(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }

    setIsSubmitting(false);
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="w-full backdrop-blur-sm bg-black/30 border-b border-white/10 shadow-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-3 drop-shadow-lg transition-transform group-hover:scale-110"
                >
                  <rect
                    width="40"
                    height="40"
                    rx="8"
                    fill="url(#navGradient)"
                  />
                  <path
                    d="M14 11C14 10.4477 14.4477 10 15 10H25C25.5523 10 26 10.4477 26 11V29C26 29.5523 25.5523 30 25 30H15C14.4477 30 14 29.5523 14 29V11Z"
                    fill="white"
                  />
                  <path
                    d="M17 15C17 14.4477 17.4477 14 18 14H22C22.5523 14 23 14.4477 23 15V17C23 17.5523 22.5523 18 22 18H18C17.4477 18 17 17.5523 17 17V15Z"
                    fill="#8B5CF6"
                  />
                  <circle cx="20" cy="22" r="2" fill="#8B5CF6" />
                  <path
                    d="M17 26C17 25.4477 17.4477 25 18 25H22C22.5523 25 23 25.4477 23 26C23 26.5523 22.5523 27 22 27H18C17.4477 27 17 26.5523 17 26Z"
                    fill="#8B5CF6"
                  />
                  <defs>
                    <linearGradient
                      id="navGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-white font-bold text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Quizzy
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 backdrop-blur-sm hover:scale-105"
              >
                Home
              </Link>
              <Link
                to="/contest"
                className="text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 backdrop-blur-sm hover:scale-105"
              >
                Contests
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 backdrop-blur-sm hover:scale-105"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="max-w-md w-full">
          <div className="group relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden">
            {/* Glassmorphism effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="p-8 relative z-10">
              <div className="mb-8 text-center">
                <QuizLogo />
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mt-6 mb-2 leading-tight tracking-tight">
                  Welcome Back!
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Sign in to your account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-white tracking-wide">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 border-0 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/20 text-white transition-all duration-300 hover:shadow-xl hover:bg-white/15"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="block text-sm font-bold text-white tracking-wide">
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs text-gray-400 hover:text-white transition-colors duration-300 hover:underline hover:scale-105"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="passWord"
                      value={formData.passWord}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 border-0 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/20 text-white transition-all duration-300 hover:shadow-xl hover:bg-white/15"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-2xl text-base font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-300">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 hover:underline transition-all duration-300 hover:scale-105"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/resetpassword"
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 hover:underline transition-all duration-300 hover:scale-105"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              By signing in, you agree to our{" "}
              <span className="underline cursor-pointer hover:text-white transition-colors duration-200 hover:scale-105">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="underline cursor-pointer hover:text-white transition-colors duration-200 hover:scale-105">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      <ToastContainer theme="colored" />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
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

export default LoginForm;
