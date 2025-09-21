import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Baseurl } from "../../main";

const Galleryedit = () => {
  const { club, id } = useParams();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const[data1,setdata]=useState([])

  const getgallery = async () => {
    try {
      const response = await axios.get(`${Baseurl}/event/galleryedit/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setGallery(response.data.gallery.imageUrl);
      setdata(response.data.gallery)
    //   console.log(response);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  useEffect(() => {
    getgallery();
  }, []);

  const handleDeleteImage = async (index) => {
    console.log("Deleting image:", index);
    setLoading(true);
    try {
      const response = await axios.delete(`${Baseurl}/event/deleteimg`, {
        data: { data1,index },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      //   setGallery(response.data.gallery.imageUrl);
      console.log(response);
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Gallery Manager
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your event gallery images
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {gallery.length} {gallery.length === 1 ? "Image" : "Images"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {gallery.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Images Found
            </h3>
            <p className="text-gray-500">
              Your gallery is empty. Add some images to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gallery.map((image, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteImage(index)}
                      disabled={loading}
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Image"
                    >
                      {loading ? (
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">
                      Image {index + 1}
                    </span>
                    <div
                      className="w-2 h-2 bg-green-400 rounded-full"
                      title="Uploaded"
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Bar */}
        {gallery.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>Hover over images to delete</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <span>Total: {gallery.length} images</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Galleryedit;
