import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  Bell,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Baseurl } from '../main';
import Navbar from './Navbar';
import ClubCard from "./ClubCard";
import { ClubsData } from '../util/constant';
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"; // ✅ Import CSS

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Keen slider setup
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 3, spacing: 15 },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 10 },
      },
      "(max-width: 640px)": {
        slides: { perView: 1, spacing: 5 },
      },
    },
  });

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
      await axios.get(`${Baseurl}/logout`, { headers:{
        'Content-Type': 'application/json',
      },withCredentials: true });
      localStorage.removeItem("userId1");
      setIsLoggedIn(false);
      setUserName('');
      navigate('/');
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-white flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-xl">
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
            🎉 Join 50,000+ Students Worldwide
          </span>
          <h2 className="mt-6 text-5xl font-extrabold leading-snug">
            Connect. <br /> Collaborate. <br />
            <span className="text-purple-600">Grow Together.</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Building vibrant student communities through collaboration and shared growth experiences.
          </p>
          <div className="mt-6 flex space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/clubs"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Browse Clubs
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
                >
                  Join Your Club Today
                </Link>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all">
                  Watch Demo
                </button>
              </>
            )}
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:ml-12">
          <img
            src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238"
            alt="Students"
            className="rounded-2xl shadow-lg w-[420px]"
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-10 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Connect
        </h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-2xl shadow p-6">
            <Search className="mx-auto h-10 w-10 text-purple-600" />
            <h3 className="mt-4 font-semibold text-lg">Discover Clubs</h3>
            <p className="text-gray-600 mt-2">
              Find clubs that match your interests and passions.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <Calendar className="mx-auto h-10 w-10 text-purple-600" />
            <h3 className="mt-4 font-semibold text-lg">Join Events</h3>
            <p className="text-gray-600 mt-2">
              Participate in workshops, meetups, and activities.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <Bell className="mx-auto h-10 w-10 text-purple-600" />
            <h3 className="mt-4 font-semibold text-lg">Stay Updated</h3>
            <p className="text-gray-600 mt-2">
              Get instant notifications about club activities.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <Users className="mx-auto h-10 w-10 text-purple-600" />
            <h3 className="mt-4 font-semibold text-lg">Connect</h3>
            <p className="text-gray-600 mt-2">
              Build meaningful relationships with peers.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Clubs with Carousel */}
      <section className="py-16 px-10 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Clubs</h2>
        
        <div className="relative">
          {/* Slider */}
          <div ref={sliderRef} className="keen-slider">
            {ClubsData.map((club, index) => (
              <div key={index} className="keen-slider__slide px-4">
                <ClubCard {...club} />
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6 text-purple-600" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
          >
            <ChevronRight className="h-6 w-6 text-purple-600" />
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
        <h2 className="text-4xl font-extrabold">Ready to Find Your Community?</h2>
        <p className="mt-4 text-lg">Join thousands of students already building connections.</p>
        <div className="mt-6 flex justify-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/clubs"
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
              >
                Browse Clubs
              </Link>
              <Link
                to="/events"
                className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                View Events
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
              >
                Join Your Club Today
              </Link>
              <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
                Learn More
              </button>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-10 py-10">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6">
            <h3 className="text-white text-lg font-bold flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span>ClubSphere</span>
            </h3>
            <p className="mt-2 text-gray-400 max-w-sm">
              Building vibrant student communities through collaboration and growth.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-semibold">Platform</h4>
              <ul className="mt-2 space-y-2">
                <li><a href="#clubs" className="hover:text-purple-400">Clubs</a></li>
                <li><a href="#events" className="hover:text-purple-400">Events</a></li>
                <li><a href="#features" className="hover:text-purple-400">Features</a></li>
                <li><a href="#pricing" className="hover:text-purple-400">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold">Support</h4>
              <ul className="mt-2 space-y-2">
                <li><a href="#help" className="hover:text-purple-400">Help Center</a></li>
                <li><a href="/contactus" className="hover:text-purple-400">Contact Us</a></li>
                <li><a href="/privacy" className="hover:text-purple-400">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-purple-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-10">© 2025 ClubSphere. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
