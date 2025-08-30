import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Baseurl } from "../main";
import { toast } from "react-toastify";

export default function EventPage() {
  const eventId = "68b2db6978a823445d593dda";
  const [event, setEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${Baseurl}/event/${eventId}`);
        console.log(res.data);
        setEvent(res.data.event);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Submit registration
  const onSubmit = async (data) => {
    try {
      await axios.post(`${Baseurl}/event/${eventId}/register`, data);
      toast.success("✅ Registered successfully!");
      setShowForm(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("❌ Something went wrong!");
    }
  };

  if (!event) {
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
          <p className="text-center text-gray-600 mt-4 font-medium">Loading your event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Event Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg bg-opacity-95">
          {/* Hero Section with Image */}
          {event.imageurl && (
            <div className="relative h-80 overflow-hidden">
              <img 
                src={event.imageurl} 
                alt="event" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-2xl">
                  {event.title}
                </h1>
              </div>
            </div>
          )}
          
          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Title (if no image) */}
            {!event.imageurl && (
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                {event.title}
              </h1>
            )}
            
            {/* Description */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>
            
            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Location Card */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 rounded-full p-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Location</h3>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
              </div>
              
              {/* Time Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 rounded-full p-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Schedule</h3>
                    <p className="text-gray-600 text-sm">
                      <span className="block">{new Date(event.start).toLocaleString()}</span>
                      <span className="text-gray-500">to</span>
                      <span className="block">{new Date(event.end).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Register Button */}
            {!showForm && (
              <div className="text-center">
                <button
                  onClick={() => setShowForm(true)}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ease-out bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-2xl transform active:scale-95"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></span>
                  <span className="relative flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Register Now</span>
                  </span>
                </button>
              </div>
            )}

            {/* Registration Form */}
            {showForm && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Registration</h2>
                  <p className="text-gray-600">Please fill out the form below to secure your spot</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {event.formjson?.fields?.map((field, idx) => (
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
                      onClick={() => setShowForm(false)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}