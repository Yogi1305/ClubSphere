import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Users, 
  Image, 
  Bell, 
  Settings, 
  Star, 
  Share2, 
  UserPlus,
  Code,
  HelpCircle,
  Info,
  ImageIcon
} from 'lucide-react';
import EventPage from '../EventPage';
import Notification from './Notification';
import Navbar from '../Navbar';
import Addgallery from './Addgallery';
import Showgallery from './Showgallery';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Baseurl } from '../../main';
import Member from './Member';
import Clubdetails from './Clubdetails';
import { useAuth } from '../../hook/Auth';
const club="HOBBY";
export default function ClubSpherePage() {
  const [activeSection, setActiveSection] = useState('club-details');
  const {role,loading}=useAuth()

  const handlejoinclub=async()=>{
    try {
         const res= await axios.post(`${Baseurl}/member/join/${club}`,{},{
          headers:{
            "Content-Type":"application/json"
          },
          withCredentials:true
          
         })
         console.log("joinclub",res);
         toast.success(res.data.message);
      
    } catch (error) {
      console.log("error in handlejoinclub",error);
      toast.error(error.response.data.message || "server failure try again")
    }
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case 'club-details':
        return (
          <div>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-xl overflow-hidden mb-6">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-30"></div>
              
              {/* Code editor background effect */}
              <div className="absolute inset-0 opacity-30">
                <div className="h-full w-full bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                  <div className="absolute top-4 left-4 text-green-300 text-xs font-mono opacity-60">
                    <div>function innovate() {}</div>
                    <div className="ml-4">return collaboration + creativity;</div>
                  </div>
                  <div className="absolute top-16 right-8 text-blue-300 text-xs font-mono opacity-60">
                    <div>&lt;TechClub&gt;</div>
                    <div className="ml-4">&lt;Innovation /&gt;</div>
                    <div>&lt;/TechClub&gt;</div>
                  </div>
                </div>
              </div>

              <div className="relative p-8 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Code className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Tech Club</h1>
                    <p className="text-blue-100 text-xl mb-4">Innovate. Create. Collaborate.</p>
                    <div className="flex items-center space-x-6 text-white">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>156 Members</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-current text-yellow-400" />
                        <span>4.8 Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button onClick={handlejoinclub} className="bg-white text-gray-700 px-6 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-50 transition-colors">
                    <UserPlus className="w-4 h-4" />
                    <span>Become a Member</span>
                  </button>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

           

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About Tech Club</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The Tech Club exists to foster innovation and technical skills among university 
                    students. We provide a collaborative environment where tech enthusiasts can learn, 
                    create, and grow together. Members gain hands-on experience through workshops, 
                    hackathons, and industry networking events.
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Club Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">156</div>
                      <div className="text-gray-600">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">24</div>
                      <div className="text-gray-600">Events</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='w-full '>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Post Holders</h3>
                <Clubdetails club={club} />
              </div>
            </div>
          </div>
        );
      
      case 'events':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            
            <EventPage club={club}/>
          </div>
        );

      case 'members':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Member club={club} />
          </div>
        );

      case 'gallery':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Addgallery club={club}/>
          </div>
        );

      case 'notifications':
        return (
          <Notification/>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Club Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                <input
                  type="text"
                  defaultValue="Tech Club"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  defaultValue="Innovate. Create. Collaborate."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Settings</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Invite Only</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
                <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      case 'showgallery':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm w-full">
            <Showgallery club={club} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clubs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Club Management */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                CLUB MANAGEMENT
              </h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveSection('club-details')}
                  className={`flex items-center space-x-3 w-full text-left rounded-lg px-3 py-2 transition-colors ${
                    activeSection === 'club-details' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>Club Details</span>
                </button>
                {/* event */}
                {
                 (role==='ADMIN'||role===club) &&(<button 
                  onClick={() => setActiveSection('events')}
                  className={`flex items-center space-x-3 w-full text-left rounded-lg px-3 py-2 transition-colors ${
                    activeSection === 'events' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Events</span>
                </button>)
                }


                {
                  (role==='ADMIN'||role===club )&&(<button 
                  onClick={() => setActiveSection('members')}
                  className={`flex items-center space-x-3 w-full text-left rounded-lg px-3 py-2 transition-colors ${
                    activeSection === 'members' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Members</span>
                </button>)
                }


               { 
                (role==='ADMIN'||role===club)&&( <button 
                  onClick={() => setActiveSection('gallery')}
                  className={`flex items-center space-x-3 w-full text-left rounded-lg px-3 py-2 transition-colors ${
                    activeSection === 'gallery' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Image className="w-4 h-4" />
                  <span>Gallery</span>
                </button>)
               }


              {
                (role==='ADMIN'&&role===club)&&(  <button 
                  onClick={() => setActiveSection('notifications')}
                  className={`flex items-center space-x-3 w-full text-left rounded-lg px-3 py-2 transition-colors ${
                    activeSection === 'notifications' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </button>)
              }


                <button 
                  onClick={() => setActiveSection('settings')}
                  className={`flex items-center space-x-3 w-full text-left rounded-lg px-3 py-2 transition-colors ${
                    activeSection === 'settings' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                 <button 
                  onClick={() => setActiveSection('showgallery')}
                  className={`flex items-center space-x-3 w-full text-left rounded-lg px-3 py-2 transition-colors ${
                    activeSection === 'showgallery' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Gallery </span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full">
            {renderMainContent()}
          </main>
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
        <HelpCircle className="w-6 h-6" />
      </button>
    </div>
  );
}