import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Calendar, Award, Code, Briefcase, Star, Zap, TrendingUp, Users } from 'lucide-react';
import Navbar from './Navbar';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Add floating animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const skills = {
    "Programming Languages": ["JavaScript (ES6+)", "C++", "C", "SQL"],
    "Frontend Development": ["React.js", "Redux", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Responsive Design", "AJAX"],
    "Backend Development": ["Node.js", "Express.js", "RESTful APIs", "Socket.io", "JWT Authentication"],
    "Database Systems": ["MongoDB", "MySQL", "NoSQL", "IndexedDB"],
    "Developer Tools": ["Git", "GitHub", "VS Code", "Webpack", "npm", "CI/CD"],
    "CS Fundamentals": ["Data Structures", "Algorithms", "OOP", "Operating Systems", "DBMS", "Computer Networks"]
  };

  const projects = [
    {
      name: "Chatly",
      tech: ["React", "Redux", "Socket.io", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT"],
      description: "Real-time messaging application with JWT authentication and responsive design",
      features: [
        "Real-time communication using Socket.io",
        "JWT authentication between React frontend and Node.js backend",
        "Redux state management with 30% reduced API latency",
        "Deployed on Vercel (frontend) and Render (backend)"
      ],
      hasLiveDemo: true,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Giphy",
      tech: ["React", "Javascript", "HTML", "Tailwind CSS"],
      description: "Interactive GIF browsing platform with trending and search features",
      features: [
        "Dynamic React components for GIF browsing",
        "Real-time trending GIF retrieval using Giphy API",
        "99% cross-browser compatibility with responsive design",
        "Easy GIF sharing through copy links and embedding"
      ],
      hasLiveDemo: true,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Shopping Site",
      tech: ["HTML", "CSS", "Javascript"],
      description: "Myntra-inspired e-commerce frontend with interactive features",
      features: [
        "Replicated Myntra's front-end design and layout",
        "Fully responsive across mobile, tablet, and desktop",
        "Interactive elements with product filtering and cart functionality"
      ],
      hasLiveDemo: false,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const achievements = [
    { platform: "LeetCode", problems: "650+", streak: "300-day", rating: null, icon: Code, color: "from-yellow-400 to-orange-500" },
    { platform: "GeeksforGeeks", problems: "500+", streak: "250-day", rating: "3-star", icon: Star, color: "from-green-400 to-emerald-500" },
    { platform: "CodeChef", problems: "150+", streak: null, rating: "1450+ rating, 2-star", icon: TrendingUp, color: "from-blue-400 to-indigo-500" }
  ];

  const experienceMetrics = [
    { label: "Performance Boost", value: "67%", icon: Zap },
    { label: "User Engagement", value: "25%", icon: Users },
    { label: "Satisfaction Score", value: "30%", icon: TrendingUp }
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-50"></div>
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      {/* <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              YK
            </div>
            <div className="hidden md:flex space-x-8">
              {['About', 'Experience', 'Skills', 'Projects', 'Achievements'].map((item) => (
                <button
                  key={item}
                  className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
                  onClick={() => setActiveSection(item.toLowerCase())}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav> */}

      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className={`min-h-screen flex items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-6xl lg:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight">
                    Yogesh
                    <br />
                    Kushwaha
                  </h1>
                  <div className="text-2xl lg:text-3xl text-gray-300 font-light">
                    Software Development Engineer
                  </div>
                  <div className="text-lg text-purple-300 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Varanasi, Uttar Pradesh
                  </div>
                </div>

                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Passionate full-stack developer crafting digital experiences with modern technologies. 
                  Currently building the future at Nuren AI with expertise in React, Node.js, and cutting-edge web technologies.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:yogesh.22273@knit.ac.in"
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                  >
                    <Mail className="w-5 h-5 mr-2 inline" />
                    Get In Touch
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </a>
                  <a
                    href="tel:+91-8115710121"
                    className="px-8 py-4 border-2 border-purple-500 rounded-full font-semibold hover:bg-purple-500/10 transition-all duration-300 flex items-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Me
                  </a>
                </div>

                <div className="flex space-x-6">
                  <a href="https://www.linkedin.com/in/yogesh-kushwaha-aa5557183/" className="group p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110">
                    <Linkedin className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                  </a>
                  <a href="https://github.com/Yogi1305" className="group p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110">
                    <Github className="w-6 h-6 text-gray-300 group-hover:text-white" />
                  </a>
                </div>
              </div>

              <div className="relative">
                {/* Floating Animation Container */}
                <div className="relative w-full max-w-lg mx-auto">
                  {/* Animated Background Rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-96 h-96 border border-purple-500/20 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
                    <div className="absolute w-80 h-80 border border-pink-500/20 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
                    <div className="absolute w-64 h-64 border border-blue-500/20 rounded-full animate-spin" style={{animationDuration: '10s'}}></div>
                  </div>

                  {/* Main Profile Container */}
                  <div className="relative z-10 animate-float">
                    {/* Glowing Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                    
                    {/* Profile Image Container */}
                    <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-2 border border-white/20 mb-6 hover:border-purple-500/50 transition-all duration-500">
                      <div className="relative group">
                        {/* Image Placeholder with Animated Border */}
                        <div className="w-64 h-64 mx-auto rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-2 border-purple-500/30 overflow-hidden group-hover:border-purple-400/60 transition-all duration-500">
                          {/* Animated Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-pink-600/20 animate-pulse"></div>
                          
                          {/* Profile Avatar Placeholder */}
                          <div className="w-full h-full flex items-center justify-center relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl animate-bounce" style={{animationDuration: '3s'}}>
                              YK
                            </div>
                            
                            {/* Floating Elements Around Avatar */}
                            <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                            <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="absolute top-1/2 left-2 w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                            <div className="absolute top-1/3 right-2 w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                          </div>

                          {/* Hover Effect Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-black flex items-center space-x-1 animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                          <span className="text-xs font-semibold text-white">Available</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500">
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-white animate-pulse">8.0</div>
                          <div className="text-purple-300">CGPA</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center group cursor-pointer">
                            <div className="text-2xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">650+</div>
                            <div className="text-xs text-gray-400">LeetCode</div>
                          </div>
                          <div className="text-center group cursor-pointer">
                            <div className="text-2xl font-bold text-blue-400 group-hover:scale-110 transition-transform duration-300">500+</div>
                            <div className="text-xs text-gray-400">GeeksforGeeks</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-purple-300 font-medium animate-pulse">Currently @ Nuren AI</div>
                        </div>
                      </div>

                      {/* Floating Action Buttons */}
                      <div className="absolute -top-3 -right-3 flex space-x-2">
                        <button className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>
                          <Code className="w-4 h-4 text-white" />
                        </button>
                        <button className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 animate-bounce" style={{animationDelay: '2.5s', animationDuration: '3s'}}>
                          <Star className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Floating Particles */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${10 + Math.random() * 80}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Experience
              </h2>
              <p className="text-gray-400 text-xl">Building the future, one line of code at a time</p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
              
              <div className="relative flex items-center justify-center">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-white/10 max-w-4xl w-full">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">Software Development Engineer Intern</h3>
                      <p className="text-2xl text-purple-400 font-semibold mb-2">Nuren AI</p>
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>March 2025 - Present • Remote</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {experienceMetrics.map((metric, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-6 text-center border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                        <metric.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                        <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                        <div className="text-sm text-gray-400">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {[
                      "Engineered frontend caching system using IndexedDB, improving application performance by 67%",
                      "Developed comprehensive analytics dashboard increasing user engagement by 25%",
                      "Led UI/UX redesign initiative resulting in 30% improvement in user satisfaction"
                    ].map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-gray-300 leading-relaxed">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Technical Arsenal
              </h2>
              <p className="text-gray-400 text-xl">Technologies I love working with</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(skills).map(([category, skillList], index) => (
                <div
                  key={category}
                  className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-xl font-semibold text-white mb-6 text-center group-hover:text-purple-300 transition-colors duration-300">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {skillList.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm font-medium text-purple-200 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Featured Projects
              </h2>
              <p className="text-gray-400 text-xl">Bringing ideas to life through code</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                        {project.name}
                      </h3>
                      {project.hasLiveDemo && (
                        <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-green-300 text-sm font-medium">Live</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/20 transition-all duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {project.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-400 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all duration-300 flex items-center justify-center group">
                        <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform duration-300" />
                        View Project
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Coding Achievements
              </h2>
              <p className="text-gray-400 text-xl">Consistency meets excellence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 text-center overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <achievement.icon className="w-12 h-12 mx-auto mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                      {achievement.platform}
                    </h3>
                    <div className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
                      {achievement.problems}
                    </div>
                    <p className="text-gray-300 mb-4">Problems Solved</p>
                    
                    <div className="space-y-2">
                      {achievement.streak && (
                        <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                          <span className="text-green-300 font-medium">{achievement.streak} streak</span>
                        </div>
                      )}
                      {achievement.rating && (
                        <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
                          <span className="text-orange-300 font-medium">{achievement.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Education
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-6 lg:mb-0">
                      <h3 className="text-3xl font-bold text-white mb-2">B.Tech - Computer Science and Engineering</h3>
                      <p className="text-2xl text-purple-400 font-semibold mb-2">Kamla Nehru Institute Of Technology</p>
                      <p className="text-gray-400">Sultanpur, Uttar Pradesh • 2022 – 2026</p>
                    </div>
                    <div className="text-center">
                      <div className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        8.0
                      </div>
                      <div className="text-purple-300 font-medium">CGPA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  Let's Build Something Amazing Together
                </div>
                <p className="text-gray-400">Always open to discussing new opportunities and innovative projects</p>
              </div>
              <div className="flex justify-center space-x-6 mb-8">
                <a href="mailto:yogesh.22273@knit.ac.in" className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110">
                  <Mail className="w-6 h-6 text-purple-400" />
                </a>
                <a href="tel:+91-8115710121" className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110">
                  <Phone className="w-6 h-6 text-purple-400" />
                </a>
                <a href="https://www.linkedin.com/in/yogesh-kushwaha-aa5557183/" className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110">
                  <Linkedin className="w-6 h-6 text-purple-400" />
                </a>
                <a href="https://github.com/Yogi1305" className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110">
                  <Github className="w-6 h-6 text-purple-400" />
                </a>
              </div>
              <p className="text-gray-500">© 2025 Yogesh Kushwaha.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
};

export default Portfolio;