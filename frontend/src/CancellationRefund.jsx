import React from 'react';

const CancellationRefund = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cancellation & Refund Policy</h1>
        
        <p className="text-gray-700 mb-4">
          At <span className="font-semibold text-indigo-600">Quizzy</span>, we strive to provide a seamless and satisfying experience while conducting online quizzes. However, we understand that sometimes cancellations may be necessary.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">🧾 General Refund Policy</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Refunds are processed within <span className="font-medium">1–2 working days</span> after a valid cancellation request.</li>
          <li>The amount will be credited to the original payment method.</li>
          <li>Any platform/service fee is non-refundable unless stated otherwise.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">🚫 Premium Feature Policy</h2>
        <p className="text-gray-700 mb-4">
          Please note that <span className="font-medium text-red-600">no refund will be issued</span> for any <span className="font-semibold">Premium Feature</span> purchases. These include features like advanced analytics, priority support, or any add-ons marked as premium.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">📬 Cancellation Process</h2>
        <p className="text-gray-700 mb-4">
          To request a cancellation and refund, please contact us at:
        </p>
        <ul className="text-gray-700">
          <li>📞 <span className="font-medium">+91 81157 10121</span></li>
          <li>📧 <a href="mailto:yogeshkushwaha567@gmail.com" className="text-indigo-600 underline">yogeshkushwaha567@gmail.com</a></li>
          <li>🔗 <a href="https://www.linkedin.com/in/yogesh-kushwaha-aa5557183" className="text-indigo-600 underline">LinkedIn</a></li>
        </ul>

        <p className="text-gray-600 text-sm mt-6">
          Quizzy reserves the right to change this policy at any time without prior notice.
        </p>
      </div>
    </div>
  );
};

export default CancellationRefund;
