import React from 'react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-12 md:px-20 lg:px-40">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Terms & Conditions</h1>
        <p className="text-gray-600 mb-8">
          Welcome to Quizzy! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
        </p>

        <section className="space-y-6 text-gray-700 text-base leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-blue-600">1. Introduction</h2>
            <p>
              Quizzy is an online quiz management platform that enables individuals and organizations to create, manage, and conduct quizzes seamlessly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600">2. User Responsibilities</h2>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>You must provide accurate information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>Quizzy is not liable for any quiz content created or shared by users.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600">3. Prohibited Activities</h2>
            <p>
              Users must not use the platform to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Upload illegal, offensive, or copyrighted content without permission.</li>
              <li>Attempt to hack, disrupt, or reverse-engineer the platform.</li>
              <li>Violate the intellectual property rights of others.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600">4. Intellectual Property</h2>
            <p>
              All content and code provided by Quizzy, including logos, designs, and software, are the intellectual property of Quizzy and may not be reused without permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600">5. Payment and Subscriptions</h2>
            <p>
              If you choose a paid plan, you agree to our pricing and billing terms. Refunds are subject to our refund policy available on the pricing page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600">6. Termination</h2>
            <p>
              Quizzy reserves the right to terminate or suspend your access if you violate our terms or engage in misuse of the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600">7. Changes to Terms</h2>
            <p>
              Quizzy may modify these terms from time to time. Users will be notified of significant changes via email or announcements on the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600">8. Contact Us</h2>
            <p>
              If you have questions about our Terms and Services, feel free to contact us at: <span className="text-blue-600">yogeshkushwaha567@gmail.com</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
