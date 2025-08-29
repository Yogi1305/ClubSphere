import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Sparkles, Shield, Lock } from "lucide-react";
import { Baseurl } from "../main";

const ProtectedRouteAdmin = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        const UserId = localStorage.getItem("userId1");
        
        if (!UserId) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        axios.defaults.withCredentials = true;
        const response = await axios.get(`${Baseurl}/isadmin`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": UserId,
          },
          withCredentials: true,
        });

        setIsAdmin(response.data?.success || false);
      } catch (error) {
        console.log("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-red-100">
        <div className="text-center">
          {/* Sparkle Animation Container */}
          <div className="relative mb-6">
            {/* Main Shield Icon */}
            <Shield className="w-16 h-16 text-red-600 mx-auto animate-pulse" />
            
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
              className="w-5 h-5 text-purple-400 absolute top-1 -left-3 animate-bounce" 
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
              Verifying Admin Access
            </h3>
            <p className="text-gray-500">
              Please wait while we check your admin credentials...
            </p>
            
            {/* Animated Dots */}
            <div className="flex justify-center space-x-1 mt-4">
              <div 
                className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                style={{ animationDelay: '0s' }}
              ></div>
              <div 
                className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div 
                className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Premium Access Required Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-orange-200">
            {/* Premium Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-white" />
              </div>
              {/* Crown sparkles */}
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-2 animate-pulse" />
              <Sparkles className="w-4 h-4 text-orange-400 absolute -bottom-1 -left-2 animate-pulse" />
            </div>

            {/* Premium Message */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Premium Feature
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To access this feature, you need to upgrade to our premium plan. 
                Unlock advanced functionality and take your experience to the next level!
              </p>
              
              {/* Features List */}
              <div className="bg-orange-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-orange-800 font-medium mb-2">Premium includes:</p>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Advanced admin features</li>
                  <li>• Priority support</li>
                  <li>• Enhanced security</li>
                  <li>• And much more...</li>
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => window.location.href = '/pricing'}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Upgrade to Premium
              </button>
              
              {/* Back Link */}
              <button
                onClick={() => window.history.back()}
                className="text-gray-500 hover:text-gray-700 text-sm underline mt-4"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRouteAdmin;