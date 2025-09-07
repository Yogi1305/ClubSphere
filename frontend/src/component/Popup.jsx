import React from 'react';

const BasicPopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative bg-white rounded-lg p-6 w-[80%] h-[80%] max-h-[90%] overflow-y-auto shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Scrollable content */}
        <div className="pr-2">{children}</div>
      </div>
    </div>
  );
};

export default BasicPopup;
