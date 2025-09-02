import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Sparkles, Shield, Lock, Crown, Star, Zap } from "lucide-react";
import { Baseurl } from "../main";

const ProtectedRouteAdmin = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState("USER");

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        const UserId = localStorage.getItem("userId1");
        
        if (!UserId) {
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
        console.log("checking role in frontend :",response.data.role)
        setIsAdmin(response.data?.role);
      } catch (error) {
        console.log("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          {/* Enhanced Loading Animation */}
          <div className="relative mb-8">
            {/* Pulsing outer ring */}
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 animate-ping"></div>
            
            {/* Main container */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Shield className="w-12 h-12 text-white animate-pulse" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute inset-0 w-24 h-24">
              <Sparkles 
                className="w-6 h-6 text-yellow-400 absolute -top-3 -right-3 animate-bounce" 
                style={{ animationDelay: '0s', animationDuration: '2s' }}
              />
              <Star 
                className="w-5 h-5 text-pink-400 absolute -bottom-2 -left-3 animate-bounce" 
                style={{ animationDelay: '0.7s', animationDuration: '2.5s' }}
              />
              <Zap 
                className="w-4 h-4 text-blue-400 absolute top-2 -left-4 animate-bounce" 
                style={{ animationDelay: '1.4s', animationDuration: '1.8s' }}
              />
              <Lock 
                className="w-4 h-4 text-purple-300 absolute top-4 right-8 animate-spin" 
                style={{ animationDuration: '4s' }}
              />
            </div>
          </div>
          
          {/* Modern loading text */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Verifying Access
            </h3>
            <p className="text-gray-600 text-lg max-w-sm mx-auto">
              Checking your administrative privileges and security clearance...
            </p>
            
            {/* Progress bar */}
            <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* Animated dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {[0, 0.2, 0.4].map((delay, index) => (
                <div 
                  key={index}
                  className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Access Denied Screen for regular users
  if (isAdmin === "USER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-lg w-full mx-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 text-center border border-white/20">
            {/* Access denied icon with animations */}
            <div className="relative mb-8">
              <div className="w-28 h-28 bg-gradient-to-br from-red-400 via-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                <Lock className="w-16 h-16 text-white" />
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute inset-0 w-28 h-28 mx-auto">
                <Crown 
                  className="w-8 h-8 text-yellow-400 absolute -top-4 -right-2 animate-bounce" 
                  style={{ animationDelay: '0s', animationDuration: '2s' }}
                />
                <Sparkles 
                  className="w-6 h-6 text-blue-400 absolute -bottom-2 -left-3 animate-bounce" 
                  style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}
                />
                <Star 
                  className="w-5 h-5 text-purple-400 absolute top-6 -left-6 animate-bounce" 
                  style={{ animationDelay: '1s', animationDuration: '1.8s' }}
                />
                <Zap 
                  className="w-6 h-6 text-green-400 absolute bottom-4 -right-5 animate-bounce" 
                  style={{ animationDelay: '1.5s', animationDuration: '2.2s' }}
                />
              </div>

              {/* Glowing ring effect */}
              <div className="absolute inset-0 w-28 h-28 mx-auto">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-red-400 to-pink-500 opacity-20 animate-ping"></div>
              </div>
            </div>

            {/* Enhanced messaging */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Access Required
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  This area is restricted to administrators only. You need elevated privileges to access these powerful features.
                </p>
              </div>
              
              {/* Premium features showcase */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Crown className="w-6 h-6 text-orange-600" />
                  <p className="text-lg font-semibold text-orange-800">Admin Features Include:</p>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm text-orange-700">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span>Advanced system management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <span>Enhanced security controls</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-orange-500" />
                    <span>Priority support & analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-orange-500" />
                    <span>Exclusive administrative tools</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2"
                >
                  <Crown className="w-5 h-5" />
                  <span>Request Admin Access</span>
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Go Home
                  </button>
                  <button
                    onClick={() => window.location.href = '/contest'}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    contest
                  </button>
                </div>
              </div>
              
              {/* Help text */}
              <p className="text-sm text-gray-500 mt-6">
                Need help? Contact your system administrator for access permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Allow access for ADMIN and other non-USER roles
  return children;
};

export default ProtectedRouteAdmin;