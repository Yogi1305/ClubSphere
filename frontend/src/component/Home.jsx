// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Users,
//   Bell,
//   Calendar,
//   Search,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Baseurl } from '../main';
// import Navbar from './Navbar';
// import ClubCard from "./ClubCard";
// import { ClubsData } from '../util/constant';
// import { useKeenSlider } from "keen-slider/react"
// import "keen-slider/keen-slider.min.css"; // ✅ Import CSS

// const Home = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   // Keen slider setup
//   const [sliderRef, instanceRef] = useKeenSlider({
//     loop: true,
//     slides: { perView: 3, spacing: 15 },
//     breakpoints: {
//       "(max-width: 1024px)": {
//         slides: { perView: 2, spacing: 10 },
//       },
//       "(max-width: 640px)": {
//         slides: { perView: 1, spacing: 5 },
//       },
//     },
//   });

//   useEffect(() => {
//     checkLoginStatus();
//   }, []);

//   const checkLoginStatus = async () => {
//     try {
//       setLoading(true);
//       axios.defaults.withCredentials = true;
//       const response = await axios.get(`${Baseurl}/checklogged`, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });
      
//       setIsLoggedIn(response.data?.success || false);
//       if (response.data?.user?.fullName) {
//         setUserName(response.data.user.fullName);
//       }
//     } catch (error) {
//       console.log("Error checking login status:", error);
//       setIsLoggedIn(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.get(`${Baseurl}/logout`, { headers:{
//         'Content-Type': 'application/json',
//       },withCredentials: true });
//       localStorage.removeItem("userId1");
//       setIsLoggedIn(false);
//       setUserName('');
//       navigate('/');
//     } catch (error) {
//       console.log("Error logging out:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white text-gray-900">
//       {/* Navbar */}
//       <Navbar />

//       {/* Hero Section */}
//       <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 bg-gradient-to-r from-gray-50 to-white">
//         <div className="max-w-xl">
//           <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
//             🎉 Join 50,000+ Students Worldwide
//           </span>
//           <h2 className="mt-6 text-5xl font-extrabold leading-snug">
//             Connect. <br /> Collaborate. <br />
//             <span className="text-purple-600">Grow Together.</span>
//           </h2>
//           <p className="mt-4 text-gray-600 text-lg">
//             Building vibrant student communities through collaboration and shared growth experiences.
//           </p>
//           <div className="mt-6 flex space-x-4">
//             {isLoggedIn ? (
//               <>
//                 <Link
//                   to="/dashboard"
//                   className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
//                 >
//                   Go to Dashboard
//                 </Link>
//                 <Link
//                   to="/clubs"
//                   className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all"
//                 >
//                   Browse Clubs
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/signup"
//                   className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
//                 >
//                   Join Your Club Today
//                 </Link>
//                 <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all">
//                   Watch Demo
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//         <div className="mt-10 md:mt-0 md:ml-12">
//           <img
//             src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238"
//             alt="Students"
//             className="rounded-2xl shadow-lg w-[420px]"
//           />
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-16 px-10 bg-gray-50">
//         <h2 className="text-3xl font-bold text-center mb-12">
//           Everything You Need to Connect
//         </h2>
//         <div className="grid md:grid-cols-4 gap-8 text-center">
//           <div className="bg-white rounded-2xl shadow p-6">
//             <Search className="mx-auto h-10 w-10 text-purple-600" />
//             <h3 className="mt-4 font-semibold text-lg">Discover Clubs</h3>
//             <p className="text-gray-600 mt-2">
//               Find clubs that match your interests and passions.
//             </p>
//           </div>
//           <div className="bg-white rounded-2xl shadow p-6">
//             <Calendar className="mx-auto h-10 w-10 text-purple-600" />
//             <h3 className="mt-4 font-semibold text-lg">Join Events</h3>
//             <p className="text-gray-600 mt-2">
//               Participate in workshops, meetups, and activities.
//             </p>
//           </div>
//           <div className="bg-white rounded-2xl shadow p-6">
//             <Bell className="mx-auto h-10 w-10 text-purple-600" />
//             <h3 className="mt-4 font-semibold text-lg">Stay Updated</h3>
//             <p className="text-gray-600 mt-2">
//               Get instant notifications about club activities.
//             </p>
//           </div>
//           <div className="bg-white rounded-2xl shadow p-6">
//             <Users className="mx-auto h-10 w-10 text-purple-600" />
//             <h3 className="mt-4 font-semibold text-lg">Connect</h3>
//             <p className="text-gray-600 mt-2">
//               Build meaningful relationships with peers.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Featured Clubs with Carousel */}
//       <section className="py-16 px-10 bg-gray-50">
//         <h2 className="text-3xl font-bold text-center mb-12">Featured Clubs</h2>
        
//         <div className="relative">
//           {/* Slider */}
//           <div ref={sliderRef} className="keen-slider">
//             {ClubsData.map((club, index) => (
//               <div key={index} className="keen-slider__slide px-4">
//                 <ClubCard {...club} />
//               </div>
//             ))}
//           </div>

//           {/* Navigation buttons */}
//           <button
//             onClick={() => instanceRef.current?.prev()}
//             className="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
//           >
//             <ChevronLeft className="h-6 w-6 text-purple-600" />
//           </button>
//           <button
//             onClick={() => instanceRef.current?.next()}
//             className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
//           >
//             <ChevronRight className="h-6 w-6 text-purple-600" />
//           </button>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="text-center py-20 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
//         <h2 className="text-4xl font-extrabold">Ready to Find Your Community?</h2>
//         <p className="mt-4 text-lg">Join thousands of students already building connections.</p>
//         <div className="mt-6 flex justify-center space-x-4">
//           {isLoggedIn ? (
//             <>
//               <Link
//                 to="/clubs"
//                 className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
//               >
//                 Browse Clubs
//               </Link>
//               <Link
//                 to="/events"
//                 className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all"
//               >
//                 View Events
//               </Link>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/signup"
//                 className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
//               >
//                 Join Your Club Today
//               </Link>
//               <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
//                 Learn More
//               </button>
//             </>
//           )}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-300 px-10 py-10">
//         <div className="flex flex-col md:flex-row justify-between">
//           <div className="mb-6">
//             <h3 className="text-white text-lg font-bold flex items-center space-x-2">
//               <Users className="h-5 w-5 text-purple-400" />
//               <span>ClubSphere</span>
//             </h3>
//             <p className="mt-2 text-gray-400 max-w-sm">
//               Building vibrant student communities through collaboration and growth.
//             </p>
//           </div>
//           <div className="grid grid-cols-2 gap-8">
//             <div>
//               <h4 className="text-white font-semibold">Platform</h4>
//               <ul className="mt-2 space-y-2">
//                 <li><a href="#clubs" className="hover:text-purple-400">Clubs</a></li>
//                 <li><a href="#events" className="hover:text-purple-400">Events</a></li>
//                 <li><a href="#features" className="hover:text-purple-400">Features</a></li>
//                 <li><a href="#pricing" className="hover:text-purple-400">Pricing</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold">Support</h4>
//               <ul className="mt-2 space-y-2">
//                 <li><a href="#help" className="hover:text-purple-400">Help Center</a></li>
//                 <li><a href="/contactus" className="hover:text-purple-400">Contact Us</a></li>
//                 <li><a href="/privacy" className="hover:text-purple-400">Privacy Policy</a></li>
//                 <li><a href="/terms" className="hover:text-purple-400">Terms of Service</a></li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         <p className="text-center text-gray-500 mt-10">© 2025 ClubSphere. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Users,
//   Bell,
//   Calendar,
//   Search,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Baseurl } from '../main';
// import Navbar from './Navbar';
// import ClubCard from "./ClubCard";
// import { ClubsData } from '../util/constant';
// import { useKeenSlider } from "keen-slider/react"
// import "keen-slider/keen-slider.min.css";

// const Home = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   const [sliderRef, instanceRef] = useKeenSlider({
//     loop: true,
//     slides: { perView: 3, spacing: 15 },
//     breakpoints: {
//       "(max-width: 1024px)": {
//         slides: { perView: 2, spacing: 10 },
//       },
//       "(max-width: 640px)": {
//         slides: { perView: 1, spacing: 5 },
//       },
//     },
//   });

//   useEffect(() => {
//     checkLoginStatus();
//   }, []);

//   const checkLoginStatus = async () => {
//     try {
//       setLoading(true);
//       axios.defaults.withCredentials = true;
//       const response = await axios.get(`${Baseurl}/checklogged`, {
//         headers: { 'Content-Type': 'application/json' },
//         withCredentials: true,
//       });
//       setIsLoggedIn(response.data?.success || false);
//       if (response.data?.user?.fullName) {
//         setUserName(response.data.user.fullName);
//       }
//     } catch (error) {
//       console.log("Error checking login status:", error);
//       setIsLoggedIn(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.get(`${Baseurl}/logout`, {
//         headers: { 'Content-Type': 'application/json' },
//         withCredentials: true,
//       });
//       localStorage.removeItem("userId1");
//       setIsLoggedIn(false);
//       setUserName('');
//       navigate('/');
//     } catch (error) {
//       console.log("Error logging out:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-950 text-gray-100">
//       {/* Navbar */}
//       <Navbar />

//       {/* Hero Section */}
//       <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 bg-gradient-to-r from-gray-900 to-gray-950">
//         <div className="max-w-xl">
//           <span className="bg-purple-900/50 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
//             🎉 Join 50,000+ Students Worldwide
//           </span>
//           <h2 className="mt-6 text-5xl font-extrabold leading-snug text-white">
//             Connect. <br /> Collaborate. <br />
//             <span className="text-purple-500">Grow Together.</span>
//           </h2>
//           <p className="mt-4 text-gray-400 text-lg">
//             Building vibrant student communities through collaboration and shared growth experiences.
//           </p>
//           <div className="mt-6 flex space-x-4">
//             {isLoggedIn ? (
//               <>
//                 <Link
//                   to="/dashboard"
//                   className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
//                 >
//                   Go to Dashboard
//                 </Link>
//                 <Link
//                   to="/clubs"
//                   className="border border-gray-600 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-800 transition-all"
//                 >
//                   Browse Clubs
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/signup"
//                   className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
//                 >
//                   Join Your Club Today
//                 </Link>
//                 <button className="border border-gray-600 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-800 transition-all">
//                   Watch Demo
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//         <div className="mt-10 md:mt-0 md:ml-12">
//           <img
//             src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238"
//             alt="Students"
//             className="rounded-2xl shadow-lg w-[420px]"
//           />
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-16 px-10 bg-gray-900">
//         <h2 className="text-3xl font-bold text-center mb-12 text-white">
//           Everything You Need to Connect
//         </h2>
//         <div className="grid md:grid-cols-4 gap-8 text-center">
//           <div className="bg-gray-800 rounded-2xl shadow p-6">
//             <Search className="mx-auto h-10 w-10 text-purple-500" />
//             <h3 className="mt-4 font-semibold text-lg text-white">Discover Clubs</h3>
//             <p className="text-gray-400 mt-2">
//               Find clubs that match your interests and passions.
//             </p>
//           </div>
//           <div className="bg-gray-800 rounded-2xl shadow p-6">
//             <Calendar className="mx-auto h-10 w-10 text-purple-500" />
//             <h3 className="mt-4 font-semibold text-lg text-white">Join Events</h3>
//             <p className="text-gray-400 mt-2">
//               Participate in workshops, meetups, and activities.
//             </p>
//           </div>
//           <div className="bg-gray-800 rounded-2xl shadow p-6">
//             <Bell className="mx-auto h-10 w-10 text-purple-500" />
//             <h3 className="mt-4 font-semibold text-lg text-white">Stay Updated</h3>
//             <p className="text-gray-400 mt-2">
//               Get instant notifications about club activities.
//             </p>
//           </div>
//           <div className="bg-gray-800 rounded-2xl shadow p-6">
//             <Users className="mx-auto h-10 w-10 text-purple-500" />
//             <h3 className="mt-4 font-semibold text-lg text-white">Connect</h3>
//             <p className="text-gray-400 mt-2">
//               Build meaningful relationships with peers.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Featured Clubs with Carousel */}
//       <section className="py-16 px-10 bg-gray-900">
//         <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Clubs</h2>

//         <div className="relative">
//           <div ref={sliderRef} className="keen-slider">
//             {ClubsData.map((club, index) => (
//               <div key={index} className="keen-slider__slide px-4">
//                 <ClubCard {...club} />
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={() => instanceRef.current?.prev()}
//             className="absolute top-1/2 left-0 -translate-y-1/2 bg-gray-800 rounded-full p-2 shadow hover:bg-gray-700"
//           >
//             <ChevronLeft className="h-6 w-6 text-purple-400" />
//           </button>
//           <button
//             onClick={() => instanceRef.current?.next()}
//             className="absolute top-1/2 right-0 -translate-y-1/2 bg-gray-800 rounded-full p-2 shadow hover:bg-gray-700"
//           >
//             <ChevronRight className="h-6 w-6 text-purple-400" />
//           </button>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="text-center py-20 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
//         <h2 className="text-4xl font-extrabold">Ready to Find Your Community?</h2>
//         <p className="mt-4 text-lg">Join thousands of students already building connections.</p>
//         <div className="mt-6 flex justify-center space-x-4">
//           {isLoggedIn ? (
//             <>
//               <Link
//                 to="/clubs"
//                 className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
//               >
//                 Browse Clubs
//               </Link>
//               <Link
//                 to="/events"
//                 className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all"
//               >
//                 View Events
//               </Link>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/signup"
//                 className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
//               >
//                 Join Your Club Today
//               </Link>
//               <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
//                 Learn More
//               </button>
//             </>
//           )}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-950 text-gray-400 px-10 py-10 border-t border-gray-800">
//         <div className="flex flex-col md:flex-row justify-between">
//           <div className="mb-6">
//             <h3 className="text-white text-lg font-bold flex items-center space-x-2">
//               <Users className="h-5 w-5 text-purple-400" />
//               <span>ClubSphere</span>
//             </h3>
//             <p className="mt-2 text-gray-500 max-w-sm">
//               Building vibrant student communities through collaboration and growth.
//             </p>
//           </div>
//           <div className="grid grid-cols-2 gap-8">
//             <div>
//               <h4 className="text-white font-semibold">Platform</h4>
//               <ul className="mt-2 space-y-2">
//                 <li><a href="#clubs" className="hover:text-purple-400">Clubs</a></li>
//                 <li><a href="#events" className="hover:text-purple-400">Events</a></li>
//                 <li><a href="#features" className="hover:text-purple-400">Features</a></li>
//                 <li><a href="#pricing" className="hover:text-purple-400">Pricing</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold">Support</h4>
//               <ul className="mt-2 space-y-2">
//                 <li><a href="#help" className="hover:text-purple-400">Help Center</a></li>
//                 <li><a href="/contactus" className="hover:text-purple-400">Contact Us</a></li>
//                 <li><a href="/privacy" className="hover:text-purple-400">Privacy Policy</a></li>
//                 <li><a href="/terms" className="hover:text-purple-400">Terms of Service</a></li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         <p className="text-center text-gray-600 mt-10">© 2025 ClubSphere. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// // export default Home;
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Users,
//   Bell,
//   Calendar,
//   Search,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Baseurl } from '../main';
// import Navbar from './Navbar';
// import ClubCard from "./ClubCard";
// import { ClubsData } from '../util/constant';
// import { useKeenSlider } from "keen-slider/react"
// import "keen-slider/keen-slider.min.css";

// /* ─── Injected styles ─────────────────────────────────────────── */
// const DARK_CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap');

//   :root {
//     --bg-base:     #07070f;
//     --bg-raised:   #0c0c18;
//     --bg-card:     #111120;
//     --border-glow: rgba(139, 92, 246, 0.18);
//     --border-sub:  rgba(255, 255, 255, 0.055);
//     --text-primary: #eeeeff;
//     --text-muted:   #7272a0;
//     --text-faint:   #3d3d62;
//     --purple-soft:  #a78bfa;
//     --indigo-soft:  #818cf8;
//   }

//   /* ── Backgrounds ── */
//   .cs-page         { background: var(--bg-base); color: var(--text-primary); }
//   .cs-spinner-bg   { background: var(--bg-base); }

//   .cs-hero {
//     background:
//       radial-gradient(ellipse 90% 70% at 65% -5%,  rgba(124,58,237,0.22) 0%, transparent 65%),
//       radial-gradient(ellipse 55% 45% at 95% 90%,  rgba(99,102,241,0.14) 0%, transparent 60%),
//       radial-gradient(ellipse 40% 35% at -5% 50%,  rgba(139,92,246,0.08) 0%, transparent 55%),
//       var(--bg-base);
//   }

//   .cs-features {
//     background:
//       radial-gradient(ellipse 65% 55% at 5% 50%,  rgba(99,102,241,0.09) 0%, transparent 60%),
//       radial-gradient(ellipse 50% 40% at 95% 20%, rgba(139,92,246,0.07) 0%, transparent 55%),
//       var(--bg-raised);
//   }

//   .cs-carousel { background: var(--bg-base); }

//   .cs-footer {
//     background:
//       linear-gradient(to top, rgba(99,102,241,0.06) 0%, transparent 80%),
//       #050508;
//     border-top: 1px solid rgba(99,102,241,0.14);
//   }

//   /* ── Cards ── */
//   .cs-card {
//     background: var(--bg-card);
//     border: 1px solid var(--border-sub);
//     transition: border-color .3s ease, transform .3s ease, box-shadow .3s ease;
//   }
//   .cs-card:hover {
//     border-color: rgba(139,92,246,0.45);
//     transform: translateY(-5px);
//     box-shadow: 0 10px 48px rgba(139,92,246,0.14);
//   }

//   /* ── Icon bubble ── */
//   .cs-icon-bubble {
//     display: inline-flex;
//     padding: 13px;
//     border-radius: 14px;
//     background: linear-gradient(135deg, rgba(139,92,246,0.22), rgba(99,102,241,0.16));
//     border: 1px solid rgba(139,92,246,0.32);
//   }

//   /* ── Badge ── */
//   .cs-badge {
//     background: linear-gradient(90deg, rgba(139,92,246,0.18), rgba(99,102,241,0.14));
//     border: 1px solid rgba(139,92,246,0.38);
//     color: #c4b5fd;
//     font-family: 'DM Sans', sans-serif;
//   }

//   /* ── Buttons ── */
//   .cs-btn-primary {
//     background: linear-gradient(135deg, #7c3aed, #4f46e5);
//     color: #fff;
//     box-shadow: 0 4px 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.12);
//     transition: opacity .2s, box-shadow .2s;
//   }
//   .cs-btn-primary:hover {
//     opacity: .9;
//     box-shadow: 0 6px 32px rgba(124,58,237,0.55);
//   }

//   .cs-btn-ghost {
//     background: rgba(255,255,255,0.04);
//     border: 1px solid rgba(255,255,255,0.11);
//     color: #b0b0d0;
//     transition: background .2s, border-color .2s;
//   }
//   .cs-btn-ghost:hover {
//     background: rgba(255,255,255,0.08);
//     border-color: rgba(255,255,255,0.2);
//   }

//   /* Slider nav */
//   .cs-slider-btn {
//     background: rgba(255,255,255,0.05);
//     border: 1px solid rgba(255,255,255,0.09);
//     transition: background .2s, box-shadow .2s, border-color .2s;
//   }
//   .cs-slider-btn:hover {
//     background: rgba(124,58,237,0.25);
//     border-color: rgba(139,92,246,0.55);
//     box-shadow: 0 0 14px rgba(139,92,246,0.3);
//   }

//   /* ── Typography ── */
//   .cs-h  { font-family: 'Syne',    sans-serif; }
//   .cs-b  { font-family: 'DM Sans', sans-serif; }

//   .cs-gradient-text {
//     background: linear-gradient(125deg, #a78bfa 0%, #818cf8 50%, #c084fc 100%);
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//   }

//   /* ── Divider ── */
//   .cs-divider {
//     height: 1px;
//     background: linear-gradient(90deg, transparent, rgba(99,102,241,0.28), transparent);
//     margin: 0 2.5rem;
//   }

//   /* ── CTA ── */
//   .cs-cta {
//     background: linear-gradient(135deg, #4338ca 0%, #6d28d9 45%, #5b21b6 100%);
//     position: relative; overflow: hidden;
//   }
//   .cs-cta::before {
//     content: '';
//     position: absolute; inset: 0;
//     background:
//       radial-gradient(ellipse 70% 90% at 15% 50%, rgba(255,255,255,0.08) 0%, transparent 55%),
//       radial-gradient(ellipse 45% 55% at 85% 10%, rgba(255,255,255,0.06) 0%, transparent 50%);
//     pointer-events: none;
//   }
//   .cs-cta > * { position: relative; }

//   .cs-cta-btn-white {
//     background: #fff;
//     color: #5b21b6;
//     font-weight: 600;
//     box-shadow: 0 4px 20px rgba(0,0,0,0.25);
//     transition: background .2s, box-shadow .2s;
//   }
//   .cs-cta-btn-white:hover {
//     background: #ede9fe;
//     box-shadow: 0 6px 28px rgba(0,0,0,0.3);
//   }

//   .cs-cta-btn-outline {
//     border: 2px solid rgba(255,255,255,0.5);
//     color: #fff;
//     transition: background .2s, border-color .2s;
//   }
//   .cs-cta-btn-outline:hover {
//     background: rgba(255,255,255,0.1);
//     border-color: rgba(255,255,255,0.75);
//   }

//   /* footer links */
//   .cs-fl { color: var(--text-faint); transition: color .2s; }
//   .cs-fl:hover { color: var(--purple-soft); }

//   /* footer section label */
//   .cs-section-label {
//     font-family: 'Syne', sans-serif;
//     font-size: 0.7rem;
//     letter-spacing: 0.12em;
//     text-transform: uppercase;
//     color: #5a5a8a;
//   }
// `;

// const Home = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userName,   setUserName]   = useState('');
//   const [loading,    setLoading]    = useState(true);
//   const navigate = useNavigate();

//   const [sliderRef, instanceRef] = useKeenSlider({
//     loop: true,
//     slides: { perView: 3, spacing: 16 },
//     breakpoints: {
//       "(max-width: 1024px)": { slides: { perView: 2, spacing: 12 } },
//       "(max-width: 640px)":  { slides: { perView: 1, spacing: 8  } },
//     },
//   });

//   useEffect(() => { checkLoginStatus(); }, []);

//   const checkLoginStatus = async () => {
//     try {
//       setLoading(true);
//       axios.defaults.withCredentials = true;
//       const response = await axios.get(`${Baseurl}/checklogged`, {
//         headers: { 'Content-Type': 'application/json' },
//         withCredentials: true,
//       });
//       setIsLoggedIn(response.data?.success || false);
//       if (response.data?.user?.fullName) setUserName(response.data.user.fullName);
//     } catch (error) {
//       console.log("Error checking login status:", error);
//       setIsLoggedIn(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.get(`${Baseurl}/logout`, {
//         headers: { 'Content-Type': 'application/json' },
//         withCredentials: true,
//       });
//       localStorage.removeItem("userId1");
//       setIsLoggedIn(false);
//       setUserName('');
//       navigate('/');
//     } catch (error) {
//       console.log("Error logging out:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <style>{DARK_CSS}</style>
//         <div className="min-h-screen cs-spinner-bg flex items-center justify-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500" />
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <style>{DARK_CSS}</style>
//       <div className="cs-page cs-b">

//         {/* ─── Navbar ─────────────────────────────────────────── */}
//         <Navbar />

//         {/* ─── Hero ───────────────────────────────────────────── */}
//         <section className="cs-hero flex flex-col md:flex-row items-center justify-between px-10 py-20 gap-12">
//           <div className="max-w-xl">
//             <span className="cs-badge inline-block px-4 py-1.5 rounded-full text-sm font-medium">
//               🎉 Join 50,000+ Students Worldwide
//             </span>

//             <h2 className="cs-h mt-7 text-5xl font-extrabold leading-tight" style={{ color: 'var(--text-primary)' }}>
//               Connect. <br />
//               Collaborate. <br />
//               <span className="cs-gradient-text">Grow Together.</span>
//             </h2>

//             <p className="mt-5 text-lg" style={{ color: 'var(--text-muted)' }}>
//               Building vibrant student communities through collaboration and shared growth experiences.
//             </p>

//             <div className="mt-8 flex flex-wrap gap-3">
//               {isLoggedIn ? (
//                 <>
//                   <Link to="/dashboard" className="cs-btn-primary px-6 py-3 rounded-xl font-medium">
//                     Go to Dashboard
//                   </Link>
//                   <Link to="/clubs" className="cs-btn-ghost px-6 py-3 rounded-xl font-medium">
//                     Browse Clubs
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/signup" className="cs-btn-primary px-6 py-3 rounded-xl font-medium">
//                     Join Your Club Today
//                   </Link>
//                   <button className="cs-btn-ghost px-6 py-3 rounded-xl font-medium">
//                     Watch Demo
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Hero image with glow halo */}
//           <div className="relative flex-shrink-0">
//             <div
//               className="absolute -inset-6 rounded-3xl blur-3xl opacity-25 pointer-events-none"
//               style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}
//             />
//             <img
//               src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238"
//               alt="Students collaborating"
//               className="relative rounded-2xl w-[420px] object-cover"
//               style={{
//                 border:     '1px solid rgba(139,92,246,0.22)',
//                 boxShadow:  '0 28px 80px rgba(0,0,0,0.65)',
//               }}
//             />
//           </div>
//         </section>

//         <div className="cs-divider" />

//         {/* ─── Features ───────────────────────────────────────── */}
//         <section className="cs-features py-20 px-10">
//           <h2 className="cs-h text-3xl font-bold text-center mb-14" style={{ color: 'var(--text-primary)' }}>
//             Everything You Need to Connect
//           </h2>

//           <div className="grid md:grid-cols-4 gap-5">
//             {[
//               { Icon: Search,   title: 'Discover Clubs', desc: 'Find clubs that match your interests and passions.'   },
//               { Icon: Calendar, title: 'Join Events',     desc: 'Participate in workshops, meetups, and activities.'   },
//               { Icon: Bell,     title: 'Stay Updated',   desc: 'Get instant notifications about club activities.'     },
//               { Icon: Users,    title: 'Connect',         desc: 'Build meaningful relationships with peers.'           },
//             ].map(({ Icon, title, desc }) => (
//               <div key={title} className="cs-card rounded-2xl p-7 text-center">
//                 <div className="flex justify-center mb-5">
//                   <span className="cs-icon-bubble">
//                     <Icon className="h-7 w-7 text-purple-400" />
//                   </span>
//                 </div>
//                 <h3 className="cs-h font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{title}</h3>
//                 <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         <div className="cs-divider" />

//         {/* ─── Featured Clubs Carousel ────────────────────────── */}
//         <section className="cs-carousel py-20 px-10">
//           <h2 className="cs-h text-3xl font-bold text-center mb-14" style={{ color: 'var(--text-primary)' }}>
//             Featured Clubs
//           </h2>

//           <div className="relative">
//             <div ref={sliderRef} className="keen-slider">
//               {ClubsData.map((club, index) => (
//                 <div key={index} className="keen-slider__slide px-2">
//                   <ClubCard {...club} />
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={() => instanceRef.current?.prev()}
//               className="cs-slider-btn absolute top-1/2 -left-5 -translate-y-1/2 rounded-full p-2.5"
//             >
//               <ChevronLeft className="h-5 w-5 text-purple-400" />
//             </button>
//             <button
//               onClick={() => instanceRef.current?.next()}
//               className="cs-slider-btn absolute top-1/2 -right-5 -translate-y-1/2 rounded-full p-2.5"
//             >
//               <ChevronRight className="h-5 w-5 text-purple-400" />
//             </button>
//           </div>
//         </section>

//         {/* ─── CTA ────────────────────────────────────────────── */}
//         <section className="cs-cta text-center py-24 text-white">
//           <h2 className="cs-h text-4xl font-extrabold">
//             Ready to Find Your Community?
//           </h2>
//           <p className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
//             Join thousands of students already building connections.
//           </p>
//           <div className="mt-8 flex justify-center gap-4 flex-wrap">
//             {isLoggedIn ? (
//               <>
//                 <Link to="/clubs"  className="cs-cta-btn-white px-6 py-3 rounded-xl">Browse Clubs</Link>
//                 <Link to="/events" className="cs-cta-btn-outline px-6 py-3 rounded-xl font-semibold">View Events</Link>
//               </>
//             ) : (
//               <>
//                 <Link to="/signup" className="cs-cta-btn-white px-6 py-3 rounded-xl">Join Your Club Today</Link>
//                 <button className="cs-cta-btn-outline px-6 py-3 rounded-xl font-semibold">Learn More</button>
//               </>
//             )}
//           </div>
//         </section>

//         {/* ─── Footer ─────────────────────────────────────────── */}
//         <footer className="cs-footer px-10 py-14">
//           <div className="flex flex-col md:flex-row justify-between gap-10">

//             <div className="max-w-xs">
//               <h3 className="cs-h text-lg font-bold flex items-center gap-2.5" style={{ color: 'var(--text-primary)' }}>
//                 <Users className="h-5 w-5 text-purple-400" />
//                 ClubSphere
//               </h3>
//               <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-faint)' }}>
//                 Building vibrant student communities through collaboration and growth.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-12">
//               <div>
//                 <p className="cs-section-label mb-4">Platform</p>
//                 <ul className="space-y-2.5">
//                   {[['#clubs','Clubs'],['#events','Events'],['#features','Features'],['#pricing','Pricing']].map(([href,label]) => (
//                     <li key={label}><a href={href} className="cs-fl text-sm">{label}</a></li>
//                   ))}
//                 </ul>
//               </div>
//               <div>
//                 <p className="cs-section-label mb-4">Support</p>
//                 <ul className="space-y-2.5">
//                   {[['#help','Help Center'],['/contactus','Contact Us'],['/privacy','Privacy Policy'],['/terms','Terms of Service']].map(([href,label]) => (
//                     <li key={label}><a href={href} className="cs-fl text-sm">{label}</a></li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="cs-divider mt-10 mb-6 mx-0" />
//           <p className="text-center text-xs" style={{ color: 'var(--text-faint)' }}>
//             © 2025 ClubSphere. All rights reserved.
//           </p>
//         </footer>

//       </div>
//     </>
//   );
// };

// export default Home;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users, Bell, Calendar, Search,
  ChevronLeft, ChevronRight,
  MapPin, Clock, ArrowRight, CalendarDays, Lock,
} from "lucide-react";
import { Baseurl } from '../main';
import Navbar from './Navbar';
import ClubCard from "./ClubCard";
import { ClubsData } from '../util/constant';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const STYLES = `

  *, *::before, *::after { cursor: none !important; }

  :root {
    --bg:        #07070f;
    --bg-raised: #0d0d1c;
    --bg-card:   #111122;
    --purple:    #7c3aed;
    --indigo:    #4f46e5;
    --purple-s:  #a78bfa;
    --indigo-s:  #818cf8;
    --txt:       #eeeeff;
    --txt-m:     #7272a0;
    --txt-f:     #3d3d62;
    --bdr:       rgba(255,255,255,0.06);
    --bdr-p:     rgba(139,92,246,0.22);
  }

  /* ── Magnetic cursor ── */
  #cs-cursor {
    position: fixed;
    top: 0; left: 0;
    width: 12px; height: 12px;
    background: #a78bfa;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%,-50%);
    transition: width .2s, height .2s, background .2s, opacity .2s;
    mix-blend-mode: screen;
  }
  #cs-cursor-ring {
    position: fixed;
    top: 0; left: 0;
    width: 36px; height: 36px;
    border: 1.5px solid rgba(167,139,250,0.55);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%,-50%);
    transition: width .35s cubic-bezier(.23,1,.32,1),
                height .35s cubic-bezier(.23,1,.32,1),
                border-color .3s, opacity .3s;
  }
  #cs-cursor.hovering      { width: 20px; height: 20px; background: #c4b5fd; }
  #cs-cursor-ring.hovering { width: 56px; height: 56px; border-color: rgba(167,139,250,0.85); }

  /* ── Page shell ── */
  .cs-page { background: var(--bg); color: var(--txt); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .cs-h    { font-family: 'Syne', sans-serif; }

  /* ── Hero: logged-out ── */
  .cs-lo-hero {
    background:
      radial-gradient(ellipse 80% 65% at 50% -10%, rgba(124,58,237,.22) 0%, transparent 65%),
      radial-gradient(ellipse 50% 40% at 90% 90%,  rgba(99,102,241,.13) 0%, transparent 60%),
      var(--bg);
    min-height: 88vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 6rem 2rem 4rem;
    position: relative; overflow: hidden;
  }
  .cs-lo-hero::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 35% 30% at 50% 105%, rgba(124,58,237,.18) 0%, transparent 60%);
    pointer-events: none;
  }

  /* ── Hero: logged-in (events) ── */
  .cs-li-hero {
    background:
      radial-gradient(ellipse 70% 55% at 50% -5%, rgba(124,58,237,.18) 0%, transparent 60%),
      var(--bg);
    padding: 7rem 2rem 5rem;
    position: relative; overflow: hidden;
  }

  /* ── Events list ── */
  .cs-event-row {
    background: var(--bg-card);
    border: 1px solid var(--bdr);
    border-radius: 16px;
    transition: border-color .3s, transform .3s, box-shadow .3s;
    position: relative; overflow: hidden;
  }
  .cs-event-row::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(180deg, var(--purple), var(--indigo));
    border-radius: 3px 0 0 3px;
    opacity: 0;
    transition: opacity .3s;
  }
  .cs-event-row:hover {
    border-color: rgba(139,92,246,.4);
    transform: translateX(6px);
    box-shadow: 0 8px 40px rgba(124,58,237,.12);
  }
  .cs-event-row:hover::before { opacity: 1; }

  .cs-date-box {
    background: linear-gradient(135deg, rgba(124,58,237,.22), rgba(79,70,229,.15));
    border: 1px solid rgba(124,58,237,.3);
    border-radius: 12px;
    min-width: 64px; padding: 10px 14px;
    text-align: center;
    flex-shrink: 0;
  }

  .cs-tag {
    font-size: .7rem; font-weight: 500; letter-spacing: .04em;
    padding: 3px 10px; border-radius: 99px;
    background: rgba(139,92,246,.15);
    border: 1px solid rgba(139,92,246,.3);
    color: #c4b5fd;
  }

  /* ── Skeleton loader ── */
  @keyframes cs-shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  .cs-skeleton {
    background: linear-gradient(90deg, #111122 25%, #1a1a35 50%, #111122 75%);
    background-size: 700px 100%;
    animation: cs-shimmer 1.4s infinite linear;
    border-radius: 10px;
  }

  /* ── Feature cards ── */
  .cs-card {
    background: var(--bg-card);
    border: 1px solid var(--bdr);
    transition: border-color .3s, transform .3s, box-shadow .3s;
    border-radius: 18px;
  }
  .cs-card:hover {
    border-color: rgba(139,92,246,.42);
    transform: translateY(-5px);
    box-shadow: 0 10px 46px rgba(124,58,237,.14);
  }
  .cs-icon-bubble {
    display: inline-flex; padding: 13px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(139,92,246,.2), rgba(99,102,241,.14));
    border: 1px solid rgba(139,92,246,.3);
  }

  /* ── Buttons ── */
  .cs-btn-p {
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: #fff; font-weight: 500;
    box-shadow: 0 4px 22px rgba(124,58,237,.38), inset 0 1px 0 rgba(255,255,255,.1);
    transition: opacity .2s, box-shadow .2s, transform .15s;
    border-radius: 14px; padding: 14px 28px;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .cs-btn-p:hover { opacity:.9; box-shadow: 0 6px 32px rgba(124,58,237,.55); transform: translateY(-1px); }

  .cs-btn-g {
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.11); color: #b0b0d0;
    transition: background .2s, border-color .2s;
    border-radius: 14px; padding: 14px 28px;
  }
  .cs-btn-g:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.2); }

  /* ── Badge ── */
  .cs-badge {
    background: linear-gradient(90deg, rgba(139,92,246,.18), rgba(99,102,241,.13));
    border: 1px solid rgba(139,92,246,.38); color: #c4b5fd;
    padding: 6px 16px; border-radius: 99px; font-size: .83rem; font-weight: 500;
    display: inline-block; margin-bottom: 1.5rem;
  }

  /* ── Gradient text ── */
  .cs-g-txt {
    background: linear-gradient(130deg, #a78bfa 0%, #818cf8 50%, #c084fc 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* ── Divider ── */
  .cs-div {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,.28), transparent);
    margin: 0 2.5rem;
  }

  /* ── Slider nav ── */
  .cs-snav {
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
    transition: background .2s, box-shadow .2s, border-color .2s; border-radius: 99px; padding: 10px;
  }
  .cs-snav:hover {
    background: rgba(124,58,237,.25); border-color: rgba(139,92,246,.55);
    box-shadow: 0 0 14px rgba(139,92,246,.3);
  }

  /* ── CTA ── */
  .cs-cta {
    background: linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #5b21b6 100%);
    position: relative; overflow: hidden;
  }
  .cs-cta::before {
    content: '';  position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 70% 90% at 15% 50%, rgba(255,255,255,.08) 0%, transparent 55%),
      radial-gradient(ellipse 45% 55% at 85% 10%, rgba(255,255,255,.06) 0%, transparent 50%);
  }
  .cs-cta > * { position: relative; }

  /* ── Footer ── */
  .cs-footer {
    background: linear-gradient(to top, rgba(99,102,241,.05) 0%, transparent 80%), #050508;
    border-top: 1px solid rgba(99,102,241,.13);
  }
  .cs-fl { color: var(--txt-f); transition: color .2s; font-size: .85rem; }
  .cs-fl:hover { color: #a78bfa; }

  /* ── Empty state ── */
  .cs-empty {
    border: 1px dashed rgba(139,92,246,.25);
    background: rgba(139,92,246,.04);
    border-radius: 18px;
    padding: 4rem 2rem;
    text-align: center;
  }

  /* ── Pulse dot ── */
  @keyframes cs-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: .4; transform: scale(1.5); }
  }
  .cs-pulse { animation: cs-pulse 2s infinite; }

  /* ── Stagger reveal ── */
  @keyframes cs-fade-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .cs-anim { animation: cs-fade-up .55s cubic-bezier(.23,1,.32,1) both; }
`;

/* ══════════════════════════════════════════════════
   MAGNETIC CURSOR
══════════════════════════════════════════════════ */
function MagneticCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ring    = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const raf     = useRef(null);

  useEffect(() => {
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };

    const onEnter = () => {
      dotRef.current?.classList.add('hovering');
      ringRef.current?.classList.add('hovering');
    };
    const onLeave = () => {
      dotRef.current?.classList.remove('hovering');
      ringRef.current?.classList.remove('hovering');
    };

    window.addEventListener('mousemove', onMove);

    const addListeners = () => {
      document.querySelectorAll('a,button,[data-magnetic]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    addListeners();
    const obs = new MutationObserver(addListeners);
    obs.observe(document.body, { childList: true, subtree: true });

    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.left = pos.current.x + 'px';
        dotRef.current.style.top  = pos.current.y + 'px';
      }
      if (ringRef.current) {
        ring.current.x += (pos.current.x - ring.current.x) * 0.12;
        ring.current.y += (pos.current.y - ring.current.y) * 0.12;
        ringRef.current.style.left = ring.current.x + 'px';
        ringRef.current.style.top  = ring.current.y + 'px';
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cs-cursor"      ref={dotRef}  />
      <div id="cs-cursor-ring" ref={ringRef} />
    </>
  );
}

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(str) {
  const d = new Date(str);
  if (isNaN(d)) return { day: '--', month: '---', time: '' };
  return {
    day:   d.getDate(),
    month: MONTH[d.getMonth()],
    year:  d.getFullYear(),
    time:  d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    full:  d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  };
}

function isUpcoming(str) {
  return new Date(str) >= new Date();
}

/* ══════════════════════════════════════════════════
   EVENT ROW
══════════════════════════════════════════════════ */
function EventRow({ event, index }) {
  const dt = fmtDate(event.date || event.startDate || event.eventDate);
  return (
    <div
      className="cs-event-row cs-anim flex flex-col md:flex-row items-start md:items-center gap-4 p-5"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Date box */}
      <div className="cs-date-box">
        <p className="cs-h text-2xl font-extrabold" style={{ color: '#c4b5fd' }}>{dt.day}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color: '#7272a0' }}>{dt.month}</p>
        <p className="text-xs" style={{ color: '#3d3d62' }}>{dt.year}</p>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {event.category && <span className="cs-tag">{event.category}</span>}
          {isUpcoming(event.date || event.startDate || event.eventDate) && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#6ee7b7' }}>
              <span className="cs-pulse inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Upcoming
            </span>
          )}
        </div>
        <h3 className="cs-h font-bold text-lg truncate" style={{ color: '#eeeeff' }}>
          {event.title || event.name || 'Untitled Event'}
        </h3>
        <p className="mt-1 text-sm line-clamp-1" style={{ color: '#7272a0' }}>
          {event.description || event.desc || ''}
        </p>

        <div className="mt-2.5 flex flex-wrap gap-4">
          {(event.location || event.venue) && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#5a5a80' }}>
              <MapPin className="h-3.5 w-3.5 text-purple-400" />
              {event.location || event.venue}
            </span>
          )}
          {dt.time && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#5a5a80' }}>
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              {dt.time}
            </span>
          )}
          {(event.clubName || event.club) && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#5a5a80' }}>
              <Users className="h-3.5 w-3.5 text-purple-400" />
              {event.clubName || event.club}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <Link
        to={`/events/${event._id || event.id}`}
        className="flex-shrink-0 p-2.5 rounded-xl transition-colors"
        style={{ background: 'rgba(124,58,237,.12)', border: '1px solid rgba(124,58,237,.22)' }}
      >
        <ArrowRight className="h-4 w-4 text-purple-400" />
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SKELETON
══════════════════════════════════════════════════ */
function EventSkeleton() {
  return (
    <div className="cs-event-row flex items-center gap-4 p-5">
      <div className="cs-skeleton w-16 h-16 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="cs-skeleton h-3 w-24 rounded" />
        <div className="cs-skeleton h-5 w-64 rounded" />
        <div className="cs-skeleton h-3 w-40 rounded" />
      </div>
      <div className="cs-skeleton w-9 h-9 rounded-xl flex-shrink-0" />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════ */
const Home = () => {
  const [isLoggedIn,    setIsLoggedIn]    = useState(false);
  const [userName,      setUserName]      = useState('');
  const [loading,       setLoading]       = useState(true);
  const [events,        setEvents]        = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const navigate = useNavigate();

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 3, spacing: 16 },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 2, spacing: 12 } },
      "(max-width: 640px)":  { slides: { perView: 1, spacing: 8  } },
    },
  });

  useEffect(() => { checkLoginStatus(); }, []);

  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${Baseurl}/checklogged`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const loggedIn = res.data?.success || false;
      setIsLoggedIn(loggedIn);
      if (res.data?.user?.fullName) setUserName(res.data.user.fullName);
      if (loggedIn) fetchEvents();
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      // Try multiple common endpoints — adapt to whichever your backend uses
      const res = await axios.get(`${Baseurl}/events`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const raw = res.data?.events || res.data?.data || res.data || [];
      const arr = Array.isArray(raw) ? raw : [];
      // Sort upcoming first
      const sorted = arr.sort((a, b) => {
        const da = new Date(a.date || a.startDate || a.eventDate || 0);
        const db = new Date(b.date || b.startDate || b.eventDate || 0);
        return da - db;
      });
      setEvents(sorted);
    } catch {
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${Baseurl}/logout`, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
      localStorage.removeItem("userId1");
      setIsLoggedIn(false); setUserName('');
      navigate('/');
    } catch {}
  };

  if (loading) return (
    <>
      <style>{STYLES}</style>
      <MagneticCursor />
      <div className="min-h-screen cs-page flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-purple-500" />
      </div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <MagneticCursor />

      <div className="cs-page page-transition">
        <Navbar />

        {/* ══ HERO ══════════════════════════════════════════════ */}
        {isLoggedIn ? (

          /* ── LOGGED IN: Events list ─────────────────────── */
          <section className="cs-li-hero">
            <div className="max-w-3xl mx-auto">

              {/* Header */}
              <div className="text-center mb-12 cs-anim">
                <span className="cs-badge">
                  <CalendarDays className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
                  Upcoming Events
                </span>
                <h1 className="cs-h text-4xl md:text-5xl font-extrabold mt-2 mb-3" style={{ color: '#eeeeff' }}>
                  What's <span className="cs-g-txt">Happening Next</span>
                </h1>
                <p style={{ color: 'var(--txt-m)' }}>
                  Events from clubs you're part of — curated just for you{userName ? `, ${userName.split(' ')[0]}` : ''}.
                </p>
              </div>

              {/* Events */}
              {eventsLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <EventSkeleton key={i} />)}
                </div>
              ) : events.length === 0 ? (
                <div className="cs-empty">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 text-purple-500 opacity-50" />
                  <p className="cs-h text-lg font-semibold" style={{ color: '#7272a0' }}>No upcoming events yet</p>
                  <p className="mt-1 text-sm" style={{ color: '#3d3d62' }}>
                    Join more clubs to see their events here.
                  </p>
                  <Link to="/clubs" className="cs-btn-p inline-flex mt-6 text-sm">
                    Browse Clubs <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((ev, i) => <EventRow key={ev._id || ev.id || i} event={ev} index={i} />)}
                </div>
              )}

              {/* Footer link */}
              {events.length > 0 && (
                <div className="text-center mt-8">
                  <Link to="/events" className="cs-btn-p inline-flex text-sm">
                    View All Events <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>

        ) : (

          /* ── LOGGED OUT: Gate ──────────────────────────── */
          <section className="cs-lo-hero">
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
              {[220, 360, 500, 640].map(s => (
                <div
                  key={s}
                  className="absolute rounded-full"
                  style={{
                    width: s, height: s,
                    border: '1px solid rgba(139,92,246,' + (0.06 + (640 - s) * 0.0002) + ')',
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 max-w-xl mx-auto cs-anim">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto"
                style={{
                  background: 'linear-gradient(135deg,rgba(124,58,237,.25),rgba(79,70,229,.18))',
                  border: '1px solid rgba(124,58,237,.35)',
                  boxShadow: '0 0 32px rgba(124,58,237,.2)',
                }}
              >
                <Lock className="h-7 w-7 text-purple-400" />
              </div>

              <span className="cs-badge">
                <CalendarDays className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
                Upcoming Events
              </span>

              <h1 className="cs-h text-4xl md:text-5xl font-extrabold mt-4 mb-5 leading-tight" style={{ color: '#eeeeff' }}>
                See What's <br />
                <span className="cs-g-txt">Happening Around You</span>
              </h1>

              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#7272a0' }}>
                Events from student clubs — workshops, meetups, hackathons &amp; more.<br />
                <strong style={{ color: '#a78bfa' }}>Log in or sign up</strong> to see upcoming events from your clubs.
              </p>

              {/* Preview blur */}
              <div className="relative mb-8 rounded-2xl overflow-hidden" style={{ filter: 'blur(0px)' }}>
                <div className="space-y-2.5 pointer-events-none select-none">
                  {[
                    { t: 'Annual Hackathon 2025',     d: '24 Mar', tag: 'Tech'     },
                    { t: 'Photography Workshop',       d: '28 Mar', tag: 'Arts'     },
                    { t: 'Entrepreneurship Summit',    d: '02 Apr', tag: 'Business' },
                  ].map(({ t, d, tag }, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        background: 'rgba(17,17,34,0.9)',
                        border: '1px solid rgba(255,255,255,.05)',
                        filter: `blur(${i * 1.5}px)`,
                        opacity: 1 - i * 0.25,
                      }}
                    >
                      <div className="cs-date-box py-2 px-3 text-center" style={{ minWidth: 52 }}>
                        <p className="cs-h text-sm font-bold" style={{ color: '#c4b5fd' }}>{d.split(' ')[0]}</p>
                        <p className="text-xs" style={{ color: '#7272a0' }}>{d.split(' ')[1]}</p>
                      </div>
                      <div className="flex-1">
                        <span className="cs-tag mr-2">{tag}</span>
                        <p className="cs-h font-semibold text-sm mt-1" style={{ color: '#eeeeff' }}>{t}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Fade overlay */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(7,7,15,0.85) 70%, rgba(7,7,15,1) 100%)',
                  }}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/login"  className="cs-btn-p">Log In <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/signup" className="cs-btn-g">Create Account</Link>
              </div>
            </div>
          </section>
        )}

        <div className="cs-div" />

        {/* ══ FEATURES ══════════════════════════════════════════ */}
        <section className="py-20 px-10" style={{ background: 'var(--bg-raised)' }}>
          <h2 className="cs-h text-3xl font-bold text-center mb-12" style={{ color: '#eeeeff' }}>
            Everything You Need to Connect
          </h2>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { Icon: Search,   title: 'Discover Clubs', desc: 'Find clubs that match your interests and passions.'  },
              { Icon: Calendar, title: 'Join Events',     desc: 'Participate in workshops, meetups, and activities.'  },
              { Icon: Bell,     title: 'Stay Updated',   desc: 'Get instant notifications about club activities.'    },
              { Icon: Users,    title: 'Connect',         desc: 'Build meaningful relationships with peers.'          },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="cs-card p-7 text-center">
                <div className="flex justify-center mb-5">
                  <span className="cs-icon-bubble"><Icon className="h-7 w-7 text-purple-400" /></span>
                </div>
                <h3 className="cs-h font-semibold text-lg" style={{ color: '#eeeeff' }}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#7272a0' }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="cs-div" />

        {/* ══ CLUBS CAROUSEL ════════════════════════════════════ */}
        <section className="py-15 px-10" style={{ background: 'var(--bg)' }}>
          <h2 className="cs-h text-3xl font-bold text-center mb-12" style={{ color: '#eeeeff' }}>Featured Clubs</h2>
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {ClubsData.map((club, i) => (
                <div key={i} className="keen-slider__slide px-2"><ClubCard {...club} /></div>
              ))}
            </div>
            <button onClick={() => instanceRef.current?.prev()} className="cs-snav absolute top-1/2 -left-5 -translate-y-1/2">
              <ChevronLeft className="h-5 w-5 text-purple-400" />
            </button>
            <button onClick={() => instanceRef.current?.next()} className="cs-snav absolute top-1/2 -right-5 -translate-y-1/2">
              <ChevronRight className="h-5 w-5 text-purple-400" />
            </button>
          </div>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════ */}
        <footer className="cs-footer px-10 py-14">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="max-w-xs">
              <h3 className="cs-h text-lg font-bold flex items-center gap-2.5" style={{ color: '#eeeeff' }}>
                <Users className="h-5 w-5 text-purple-400" />ClubSphere
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--txt-f)' }}>
                Building vibrant student communities through collaboration and growth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <p className="cs-h text-xs uppercase tracking-widest mb-4" style={{ color: '#5a5a8a' }}>Platform</p>
                <ul className="space-y-2.5">
                  {[['#clubs','Clubs'],['#events','Events'],['#features','Features'],['#pricing','Pricing']].map(([h,l]) => (
                    <li key={l}><a href={h} className="cs-fl">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="cs-h text-xs uppercase tracking-widest mb-4" style={{ color: '#5a5a8a' }}>Support</p>
                <ul className="space-y-2.5">
                  {[['#help','Help Center'],['/contactus','Contact Us'],['/privacy','Privacy Policy'],['/terms','Terms']].map(([h,l]) => (
                    <li key={l}><a href={h} className="cs-fl">{l}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="cs-div mt-10 mb-6 mx-0" />
          <p className="text-center text-xs" style={{ color: 'var(--txt-f)' }}>© 2025 ClubSphere. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Home;