import React from 'react';

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">🎉 Thank You for Your Purchase!</h1>
        <p className="text-gray-700 text-lg mb-4">
          Your payment has been successfully processed.
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <p className="text-purple-800 font-medium">
            The purchased quiz or product will be automatically added to your account within <span className="font-bold">1 minute</span>.
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          If your purchase doesn't appear within a minute, please refresh your dashboard or contact our support team.
        </p>

        <a
          href="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 mb-8"
        >
          Go to My Account
        </a>

        <div className="text-left bg-gray-50 border border-gray-200 rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">🚚 Shipping Policy</h2>
          <p className="text-gray-700 text-sm mb-2">
            At <strong>Quizzy</strong>, all products are delivered digitally. Once your payment is confirmed, your quiz content or service will be added to your account automatically within 1 minute.
          </p>
          <p className="text-gray-700 text-sm mb-2">
            No physical items are shipped. You can access your purchase by navigating to your <strong>Dashboard</strong>.
          </p>
          <p className="text-gray-700 text-sm">
            If you face any delay or issues, please reach out to our support team at <a href="mailto:yogeshkushwaha567@gmail.com" className="text-purple-600 underline">yogeshkushwaha567@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
