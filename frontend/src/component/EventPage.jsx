import React, { useEffect, useState } from "react";
import { useForm, Controller, set } from "react-hook-form";
import axios from "axios";
import { Baseurl } from "../main";
import { toast } from "react-toastify";
import BasicPopup from "./Popup";
import CreateEventPage from "./Event";
import { useAuth } from "../hook/Auth";

export default function EventPage({club}) {
  
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const[popup,setPopup]=useState(false);
    const {role,loading}=useAuth()
  const [loader,setloader]=useState(true);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm();

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${Baseurl}/event/allevent/${club}`,{headers:{
          "Content-Type":"application/json"
        },      withCredentials:true});
        console.log(res.data);
        setEvents(res.data.events);
          setloader(false);
      } catch (err) {

        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, [club]);

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
    reset(); // Reset form when opening new event
  };

  // Submit registration
const onSubmit = async (data) => {

  try {
    
    // console.log(data,typeof data);
    const response = await axios.post(`${Baseurl}/event/registerto/${selectedEvent._id}`, data,
      {
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      }
    );
    toast.success(response.data?.message || "✅ Registered successfully!");
    setShowForm(false);
    setSelectedEvent(null);
  } catch (error) {
    console.error("Error submitting form:", error);

    // Extract backend error message if available
    const errMsg =
      error.response?.data?.message ||
      error.message ||
      "❌ Something went wrong!";

    toast.error(errMsg);
  }
};


  // Close popup
  const closePopup = () => {
    setShowForm(false);
    setSelectedEvent(null);
    reset();
  };

  if (loader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
          <p className="text-center text-gray-600 mt-4 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Club Events
          </h1>
          <p className="text-gray-600 text-lg">Discover and register for upcoming events</p>
        </div>
         {/* create a event */}
         {
          (role==='ADMIN'||role===club) && (
            <div className="text-center mb-10">
           <button onClick={() => setPopup(true)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
             Create Event
           </button>
           <BasicPopup isOpen={popup} onClose={() => setPopup(false)}>
             <CreateEventPage clubId={club} />
           </BasicPopup>
         </div>
          )
         }
        {/* Events Grid */}
        {
          events.length === 0 ? (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
           <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
             </div>
           <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
          <p className="text-center text-gray-600 mt-4 font-medium">no event found...</p>
        </div>
      </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div 
              key={event._id || index} 
              className="bg-white rounded-3xl shadow-xl overflow-hidden backdrop-blur-lg bg-opacity-95 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              {/* Event Image */}
              {event.imageurl && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.imageurl} 
                    alt={event.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              )}
              
              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                {/* Event Details */}
                <div className="space-y-3">
                  {/* Location */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{event.location}</span>
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{new Date(event.start).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Register Button */}
                <div className="mt-6">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
          )
        }

        {/* Registration Popup */}
        {showForm && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Popup Header */}
              <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Register for Event</h2>
                  <p className="text-gray-600 mt-1">{selectedEvent.title}</p>
                </div>
                <button
                  onClick={closePopup}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Event Details in Popup */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Location</p>
                      <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Date & Time</p>
                      <p className="text-sm text-gray-600">{new Date(selectedEvent.start).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {selectedEvent.formjson?.fields?.map((field, idx) => (
                    <div key={idx} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {field.type === "select" ? (
                        <Controller
                          name={field.name}
                          control={control}
                          rules={{ required: field.required }}
                          render={({ field: controllerField }) => (
                            <select 
                              {...controllerField} 
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-700"
                            >
                              <option value="" className="text-gray-400">Select an option</option>
                              {field.options?.map((opt, i) => (
                                <option key={i} value={opt} className="text-gray-700">
                                  {opt}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                      ) : (
                        <input
                          type={field.type}
                          {...register(field.name, { required: field.required })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}

                      {errors[field.name] && (
                        <p className="text-red-500 text-sm flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>This field is required</span>
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Submit Registration</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={closePopup}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-500 hover:to-gray-600 transform hover:scale-105 transition-all duration-200"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Cancel</span>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}