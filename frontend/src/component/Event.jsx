import React, { useState } from "react";
import { Baseurl } from "../main";
import { toast } from "react-toastify";
import axios from "axios";

export default function CreateEventPage() {
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

      // Replace with your actual API call
      console.log('Creating event:', finalEventData);
      const response=await axios.post(`${Baseurl}/event`, finalEventData);

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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
      
      <div onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Event Info */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Event Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Event Title *</label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => handleEventChange('title', e.target.value)}
                className="w-full border p-3 rounded"
                placeholder="Enter event title"
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                value={eventData.description}
                onChange={(e) => handleEventChange('description', e.target.value)}
                className="w-full border p-3 rounded h-24"
                placeholder="Describe your event"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Location</label>
              <input
                type="text"
                value={eventData.location}
                onChange={(e) => handleEventChange('location', e.target.value)}
                className="w-full border p-3 rounded"
                placeholder="Event location"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Image URL</label>
              <input
                type="url"
                value={eventData.imageurl}
                onChange={(e) => handleEventChange('imageurl', e.target.value)}
                className="w-full border p-3 rounded"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                value={eventData.start}
                onChange={(e) => handleEventChange('start', e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                value={eventData.end}
                onChange={(e) => handleEventChange('end', e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Form Builder */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Registration Form Fields</h2>
            <button
              type="button"
              onClick={addFormField}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Field
            </button>
          </div>

          {formFields.length === 0 && (
            <p className="text-gray-600 text-center py-8">
              No form fields added yet. Click "Add Field" to start building your registration form.
            </p>
          )}

          {formFields.map((field, index) => (
            <div key={field.id} className="bg-white p-4 rounded border mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-700">Field {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeFormField(field.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕ Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Field Name</label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateFormField(field.id, { name: e.target.value })}
                    className="w-full border p-2 rounded text-sm"
                    placeholder="field_name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Label</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                    className="w-full border p-2 rounded text-sm"
                    placeholder="Display label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Field Type</label>
                  <select
                    value={field.type}
                    onChange={(e) => updateFormField(field.id, { type: e.target.value })}
                    className="w-full border p-2 rounded text-sm"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Dropdown</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm">Required field</label>
              </div>

              {/* Options for select fields */}
              {field.type === 'select' && (
                <div className="border-t pt-3">
                  <label className="block text-sm font-medium mb-2">Dropdown Options</label>
                  <div className="space-y-2">
                    {field.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...field.options];
                            newOptions[optIndex] = e.target.value;
                            updateFormField(field.id, { options: newOptions });
                          }}
                          className="flex-1 border p-1 rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(field.id, optIndex)}
                          className="text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add new option"
                        className="flex-1 border p-1 rounded text-sm"
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
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
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

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={clearForm}
            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Create Event
          </button>
        </div>
        </div>

      {/* Preview Section */}
      {formFields.length > 0 && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Registration Form Preview</h3>
          <div className="space-y-3">
            {formFields.map((field) => (
              <div key={field.id} className="flex flex-col">
                <label className="font-medium mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select className="border p-2 rounded bg-white" disabled>
                    <option>Select...</option>
                    {field.options?.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="border p-2 rounded bg-white"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    disabled
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}