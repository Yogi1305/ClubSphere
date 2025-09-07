import React, { useState } from "react";
import { Baseurl } from "../main";
import { toast } from "react-toastify";
import axios from "axios";

export default function CreateEventPage({club}) {
  const [formFields, setFormFields] = useState([]);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    start: '',
    end: '',
    imageurl: ''
  });
  const [errors, setErrors] = useState({});

  // Add new form field
  const addFormField = () => {
    const newField = {
      id: Date.now(),
      name: `field_${formFields.length + 1}`,
      label: "",
      type: "text",
      required: false,
      options: [] // for select fields
    };
    setFormFields([...formFields, newField]);
  };

  // Remove form field
  const removeFormField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  // Update form field
  const updateFormField = (id, updates) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  // Add option to select field
  const addOption = (fieldId, option) => {
    if (!option.trim()) return;
    updateFormField(fieldId, {
      options: [...(formFields.find(f => f.id === fieldId)?.options || []), option]
    });
  };

  // Remove option from select field
  const removeOption = (fieldId, optionIndex) => {
    const field = formFields.find(f => f.id === fieldId);
    const newOptions = field.options.filter((_, index) => index !== optionIndex);
    updateFormField(fieldId, { options: newOptions });
  };

  // Handle event data changes
  const handleEventChange = (field, value) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!eventData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit event creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Prepare the event data with form structure
      const finalEventData = {
        ...eventData,
        formjson: {
          fields: formFields.map(field => ({
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required,
            ...(field.type === 'select' && { options: field.options })
          }))
        }
      };

      if(club) finalEventData.club = club;
      // console.log('Creating event:', finalEventData);
      const response = await axios.post(`${Baseurl}/event`, finalEventData,{
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      toast.success(response.data.message || "✅ Event created successfully");
      
      // Reset form
      setEventData({
        title: '',
        description: '',
        location: '',
        start: '',
        end: '',
        imageurl: ''
      });
      setFormFields([]);
      setErrors({});
    } catch (err) {
      console.error("Error creating event:", err);
      toast.error(err.response?.data?.message || "❌ Failed to create event");
    }
  };

  // Clear form
  const clearForm = () => {
    setEventData({
      title: '',
      description: '',
      location: '',
      start: '',
      end: '',
      imageurl: ''
    });
    setFormFields([]);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Create New Event
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Design your perfect event with our intuitive form builder. Create custom registration forms and bring your vision to life.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {/* Basic Event Info */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Event Details</h2>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={eventData.title}
                      onChange={(e) => handleEventChange('title', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      placeholder="Enter your event title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.title}</span>
                      </p>
                    )}
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={eventData.description}
                      onChange={(e) => handleEventChange('description', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                      rows="4"
                      placeholder="Describe your event in detail..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </label>
                    <input
                      type="text"
                      value={eventData.location}
                      onChange={(e) => handleEventChange('location', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      placeholder="Event venue or address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={eventData.imageurl}
                      onChange={(e) => handleEventChange('imageurl', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={eventData.start}
                      onChange={(e) => handleEventChange('start', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={eventData.end}
                      onChange={(e) => handleEventChange('end', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Form Builder */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Registration Form Builder</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addFormField}
                    className="bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-2 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Field</span>
                  </button>
                </div>
              </div>

              <div className="p-8">
                {formFields.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 max-w-md mx-auto">
                      <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No form fields yet</h3>
                      <p className="text-gray-500">Click "Add Field" to start building your registration form</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formFields.map((field, index) => (
                      <div key={field.id} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="font-semibold text-gray-700">Form Field {index + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFormField(field.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => updateFormField(field.id, { name: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 text-sm"
                              placeholder="field_name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Label</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 text-sm"
                              placeholder="Display label"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                            <select
                              value={field.type}
                              onChange={(e) => updateFormField(field.id, { type: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 text-sm bg-white"
                            >
                              <option value="text">📝 Text</option>
                              <option value="email">📧 Email</option>
                              <option value="tel">📞 Phone</option>
                              <option value="number">🔢 Number</option>
                              <option value="date">📅 Date</option>
                              <option value="select">📋 Dropdown</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                          />
                          <label className="ml-2 text-sm font-medium text-gray-700">Required field</label>
                        </div>

                        {/* Options for select fields */}
                        {field.type === 'select' && (
                          <div className="border-t-2 border-gray-100 pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                              </svg>
                              Dropdown Options
                            </label>
                            <div className="space-y-2">
                              {field.options?.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...field.options];
                                      newOptions[optIndex] = e.target.value;
                                      updateFormField(field.id, { options: newOptions });
                                    }}
                                    className="flex-1 px-3 py-1 rounded border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 text-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeOption(field.id, optIndex)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Add new option"
                                  className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addOption(field.id, e.target.value);
                                      e.target.value = '';
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    const input = e.target.parentElement.querySelector('input');
                                    addOption(field.id, input.value);
                                    input.value = '';
                                  }}
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            {formFields.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Form Preview</h2>
                  </div>
                </div>
                <div className="p-8">
                  <div className="max-w-2xl mx-auto space-y-6">
                    {formFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {field.label || 'Untitled Field'}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700" disabled>
                            <option>Select an option...</option>
                            {field.options?.map((opt, i) => (
                              <option key={i}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 placeholder-gray-400"
                            placeholder={`Enter ${(field.label || 'value').toLowerCase()}`}
                            disabled
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button
                type="button"
                onClick={clearForm}
                className="w-full sm:w-auto bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold px-8 py-4 rounded-2xl hover:from-gray-500 hover:to-gray-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Clear All</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Create Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}