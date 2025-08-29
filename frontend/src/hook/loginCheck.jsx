import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Sparkles, Shield, Lock } from "lucide-react";
import { Baseurl } from "../main";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
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

      } catch (err) {
        console.error("Login check failed: hook :", err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          {/* Sparkle Animation Container */}
          <div className="relative mb-6">
            {/* Main Shield Icon */}
            <Shield className="w-16 h-16 text-indigo-600 mx-auto animate-pulse" />
            
            {/* Animated Sparkles */}
            <Sparkles 
              className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" 
              style={{ animationDelay: '0s', animationDuration: '1.5s' }}
            />
            <Sparkles 
              className="w-4 h-4 text-pink-400 absolute -bottom-1 -left-1 animate-bounce" 
              style={{ animationDelay: '0.5s', animationDuration: '1.8s' }}
            />
            <Sparkles 
              className="w-5 h-5 text-blue-400 absolute top-1 -left-3 animate-bounce" 
              style={{ animationDelay: '1s', animationDuration: '1.2s' }}
            />
            
            {/* Rotating Lock */}
            <Lock 
              className="w-3 h-3 text-gray-400 absolute top-3 right-6 animate-spin" 
              style={{ animationDuration: '3s' }}
            />
          </div>
          
          {/* Loading Text */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">
              Verifying Access
            </h3>
            <p className="text-gray-500">
              Please wait while we check your credentials...
            </p>
            
            {/* Animated Dots */}
            <div className="flex justify-center space-x-1 mt-4">
              <div 
                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: '0s' }}
              ></div>
              <div 
                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div 
                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;