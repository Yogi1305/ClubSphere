import React, { useEffect, useState } from "react";
import {
  Upload,
  X,
  Image,
  Send,
  Loader2,
  Plus,
  Camera,
  Eye,
  ChevronUp,
  ChevronDown,
  Edit,
  Calendar,
  MapPin,
  Users,
  DownloadIcon,
} from "lucide-react";
import axios from "axios";
import { Baseurl } from "../../main";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { exportParticipantsToExcel } from "../../util/exportfile";

const Addgallery = ({ club }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [sortedParticipants, setSortedParticipants] = useState([]);
  const [batchSortOrder, setBatchSortOrder] = useState("none"); // 'asc', 'desc', 'none'
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const navigate = useNavigate();

  // Gallery form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${Baseurl}/event/allevent/${club}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log(res.data.events);
        setEvents(res.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Failed to fetch events");
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, [club]);

  // Sort participants by batch when participants or sort order changes
  useEffect(() => {
    let sorted = [...participants];

    if (batchSortOrder === "asc") {
      sorted.sort((a, b) => {
        const batchA = a.UserId?.batch || "";
        const batchB = b.UserId?.batch || "";
        return batchA.localeCompare(batchB);
      });
    } else if (batchSortOrder === "desc") {
      sorted.sort((a, b) => {
        const batchA = a.UserId?.batch || "";
        const batchB = b.UserId?.batch || "";
        return batchB.localeCompare(batchA);
      });
    }

    setSortedParticipants(sorted);
  }, [participants, batchSortOrder]);

  // Fetch event participants
  const fetchParticipants = async (eventId) => {
    setParticipantsLoading(true);
    try {
      // Replace with your actual API endpoint for fetching event participants
      const res = await axios.get(`${Baseurl}/event/participants/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setParticipants(res.data.event || []);
      console.log("Fetched participants:", res.data.event);
    } catch (err) {
      console.error("Error fetching participants:", err);
      toast.error("Failed to fetch event participants");
      setParticipants([]);
    } finally {
      setParticipantsLoading(false);
    }
  };

  // Handle view participants click
  const handleViewParticipants = async (event) => {
    setSelectedEvent(event);
    setShowParticipantsModal(true);
    setBatchSortOrder("none"); // Reset sort order
    await fetchParticipants(event._id);
  };

  // Close participants modal
  const closeParticipantsModal = () => {
    setShowParticipantsModal(false);
    setSelectedEvent(null);
    setParticipants([]);
    setSortedParticipants([]);
    setBatchSortOrder("none");
  };

  // Handle batch column sorting
  const handleBatchSort = () => {
    if (batchSortOrder === "none" || batchSortOrder === "desc") {
      setBatchSortOrder("asc");
    } else {
      setBatchSortOrder("desc");
    }
  };

  // Get sort icon for batch column
  const getBatchSortIcon = () => {
    if (batchSortOrder === "asc") {
      return <ChevronUp className="w-4 h-4 ml-1" />;
    } else if (batchSortOrder === "desc") {
      return <ChevronDown className="w-4 h-4 ml-1" />;
    }
    return <div className="w-4 h-4 ml-1" />; // placeholder for alignment
  };

  // Handle add gallery click
  const handleAddGallery = (event) => {
    setSelectedEvent(event);
    setShowGalleryForm(true);
    // Pre-fill with event title if desired
    setFormData({
      title: `${event.title} Gallery`,
      description: `Gallery for ${event.title} event`,
    });
  };

  // Handle edit event click
  const handleEditEvent = (event) => {
    navigate(`/gallery/${club}/${event._id}`);
  };

  // Close popup
  const closePopup = () => {
    setShowGalleryForm(false);
    setSelectedEvent(null);
    setFormData({ title: "", description: "" });
    setFiles([]);
    setDragActive(false);
  };

  // Gallery form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    if (validFiles.length !== newFiles.length) {
      toast.warning("Some files were skipped (only images up to 10MB allowed)");
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("eventId", selectedEvent._id); // Include event ID
      formDataToSend.append("club", club);

      files.forEach((file, index) => {
        formDataToSend.append("images", file);
      });

      // Axios API call
      const response = await axios.post(
        `${Baseurl}/upload/addgallery`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
          withCredentials: true,
        }
      );

      console.log("Gallery created successfully:", response.data);

      // Reset form and close popup
      closePopup();

      toast.success("Gallery created successfully!");
    } catch (error) {
      console.error("Error creating gallery:", error);
      toast.error(error.response?.data?.message || "Failed to create gallery");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-xl w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-xl w-1/2"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
          </div>
          <p className="text-center text-gray-600 mt-4 font-medium">
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4 text-center">
          <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Events Found
          </h2>
          <p className="text-gray-600">
            No events available for this club yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
            Event Gallery Hub
          </h1>
          <p className="text-gray-600 text-xl font-medium">
            Create stunning galleries for your events
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={event._id || index}
              className="group bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:bg-white/80 transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]"
            >
              {/* Event Image with Overlay */}
              <div className="relative h-56 overflow-hidden">
                {event.imageurl ? (
                  <>
                    <img
                      src={event.imageurl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {/* <button
                    onClick={() => handleViewParticipants(event)}
                    className="p-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-200 group/btn"
                    title="View Participants"
                  >
                    <Eye className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" /> */}
                  {/* </button> */}
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="p-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-200 group/btn"
                    title="Edit Event"
                  >
                    <Edit className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Event Status Badge */}
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md rounded-full">
                    <span className="text-white text-sm font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Event Meta Information */}
                <div className="space-y-3 mb-6">
                  {/* Location */}
                  <div className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium truncate">
                      {event.location}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">
                      {new Date(event.start).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Participants Count */}
                  <div
                    className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer"
                    onClick={() => handleViewParticipants(event)}
                  >
                    <div className="p-2 bg-emerald-100 rounded-full">
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium">View participants</span>
                  </div>
                </div>

                {/* Add Gallery Button */}
                <button
                  onClick={() => handleAddGallery(event)}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 group/button"
                >
                  <Plus className="w-5 h-5 group-hover/button:rotate-90 transition-transform duration-300" />
                  <span>Create Gallery</span>
                </button>
              </div>

              {/* Card Bottom Accent */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
            </div>
          ))}
        </div>

        {/* Participants Modal */}
        {showParticipantsModal && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Event Participants</h2>
                  <p className="text-blue-100 mt-1">{selectedEvent.title}</p>
                </div>
                <button
                  onClick={() =>
                    exportParticipantsToExcel(participants, selectedEvent.title)
                  }
                  className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all text-sm font-semibold backdrop-blur-md"
                >
                  Export as Excel 
                
                </button>

                <button
                  onClick={closeParticipantsModal}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Participant Count */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Total Participants:{" "}
                    <span className="font-semibold text-gray-800">
                      {participants.length}
                    </span>
                  </div>

                  {batchSortOrder !== "none" && (
                    <div className="text-sm text-gray-600">
                      Sorted by batch (
                      {batchSortOrder === "asc" ? "A-Z" : "Z-A"})
                    </div>
                  )}
                </div>

                {/* Participants Table */}
                <div className="overflow-x-auto max-h-96 rounded-2xl border border-gray-200">
                  {participantsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      <span className="ml-2 text-gray-600">
                        Loading participants...
                      </span>
                    </div>
                  ) : sortedParticipants.length > 0 ? (
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Student Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={handleBatchSort}
                          >
                            <div className="flex items-center">
                              Batch
                              {getBatchSortIcon()}
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Contact Number
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sortedParticipants.map((participant, index) => (
                          <tr
                            key={participant._id || index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900">
                                {participant.UserId?.fullName || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700">
                                {participant.UserId?.email || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                                {participant.UserId?.Batch || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                              {participant.UserId?.contact || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">
                        No participants found for this event.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Upload Popup */}
        {showGalleryForm && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Popup Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-xl rounded-t-3xl border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Create Gallery
                  </h2>
                  <p className="text-gray-600 mt-1">
                    For event: {selectedEvent.title}
                  </p>
                </div>
                <button
                  onClick={closePopup}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Gallery Form */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Gallery Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter gallery title..."
                      required
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter gallery description..."
                    />
                  </div>

                  {/* File Upload Area */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Gallery Images *
                    </label>

                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                        dragActive
                          ? "border-blue-500 bg-blue-50 scale-105"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-bold text-gray-700 mb-2">
                        Drop images here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>

                  {/* Selected Files Preview */}
                  {files.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Selected Images ({files.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="relative bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <Image className="h-6 w-6 text-gray-400 mt-1" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Image Preview */}
                            <div className="mt-3">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-32 object-cover rounded-xl border"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          title: `${selectedEvent.title} Gallery`,
                          description: `Gallery for ${selectedEvent.title} event`,
                        });
                        setFiles([]);
                      }}
                      className="sm:flex-none bg-gray-500 text-white font-bold py-3 px-6 rounded-2xl hover:bg-gray-600 transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      Reset
                    </button>

                    <button
                      type="submit"
                      disabled={
                        loading || !formData.title.trim() || files.length === 0
                      }
                      className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating Gallery...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Create Gallery</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={closePopup}
                      className="sm:flex-none bg-gray-500 text-white font-bold py-3 px-6 rounded-2xl hover:bg-gray-600 transition-colors"
                      disabled={loading}
                    >
                      Cancel
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
};

export default Addgallery;
