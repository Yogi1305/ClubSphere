import React, { useEffect, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar, X } from 'lucide-react';
import { Baseurl } from '../../main';
import axios from 'axios';

const Showgallery = ({ club }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const getgallery = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Baseurl}/event/gallery/${club}`);
      setGallery(response.data.gallery);
      console.log(response.data.gallery);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getgallery();
  }, [club]);

  const openModal = (imageUrl, eventTitle) => {
    setModalImage({ imageUrl, eventTitle });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    if (showModal) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Individual event gallery component
  const EventGallery = ({ item, index }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const [sliderRef, instanceRef] = useKeenSlider({
      loop: item.imageUrl && item.imageUrl.length > 1,
      slides: {
        perView: 1,
        spacing: 15,
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      breakpoints: {
        '(min-width: 640px)': {
          slides: {
            perView: item.imageUrl && item.imageUrl.length >= 2 ? 2 : 1,
            spacing: 20,
          },
        },
        '(min-width: 1024px)': {
          slides: {
            perView: item.imageUrl && item.imageUrl.length >= 3 ? 3 : item.imageUrl?.length || 1,
            spacing: 25,
          },
        },
      },
    });

    if (!item.imageUrl || item.imageUrl.length === 0) {
      return (
        <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
          {/* Event Details */}
          {item.EventId ? (
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {item.EventId.title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-red-400" />
                  <span>{item.EventId.location}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-green-400" />
                  <span>{new Date(item.EventId.start).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-blue-400" />
                  <span>{new Date(item.EventId.end).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No event details available</p>
          )}
          
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-500">No images available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
        {/* Event Details */}
        {item.EventId ? (
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {item.EventId.title}
            </h3>
            <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-red-400" />
                <span>{item.EventId.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-green-400" />
                <span>{new Date(item.EventId.start).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                <span>{new Date(item.EventId.end).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <p className="text-gray-500">No event details available</p>
          </div>
        )}

        {/* Image Carousel */}
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {item.imageUrl.map((image, imgIndex) => (
              <div key={imgIndex} className="keen-slider__slide">
                <div className="relative group cursor-pointer">
                  <img
                    src={image}
                    alt={`Gallery image ${imgIndex + 1}`}
                    className="w-full h-80 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    onClick={() => openModal(image, item.EventId?.title)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                    }}
                  />
                  
                
                 
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          {item.imageUrl.length > 1 && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl z-10 group"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              </button>

              <button
                onClick={() => instanceRef.current?.next()}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl z-10 group"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {item.imageUrl.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {item.imageUrl.map((_, imgIndex) => (
                <button
                  key={imgIndex}
                  onClick={() => instanceRef.current?.moveToIdx(imgIndex)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    imgIndex === currentSlide
                      ? 'bg-blue-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Image counter */}
          {item.imageUrl.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
              {currentSlide + 1} / {item.imageUrl.length}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!gallery || gallery.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Club Gallery</h2>
        <p className="text-gray-600">No gallery items found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          {club} Club Gallery
        </h1>

        {/* Render each gallery item */}
        {gallery.map((item, index) => (
          <EventGallery key={index} item={item} index={index} />
        ))}
      </div>

      {/* Modal for enlarged image */}
      {showModal && modalImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Modal Image */}
            <img
              src={modalImage.imageUrl}
              alt={modalImage.eventTitle || 'Gallery image'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Event title in modal */}
            {modalImage.eventTitle && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-6 rounded-b-lg">
                <h3 className="text-xl font-bold text-center">{modalImage.eventTitle}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Showgallery;