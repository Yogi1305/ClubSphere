import React from 'react';
import { Mail, Phone, Linkedin } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-6 md:px-20 lg:px-40">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          We'd love to hear from you! Whether you have a question, suggestion, or need support with Clubsphere — feel free to reach out.
        </p>

        <div className="space-y-6">
          {/* Phone */}
          <div className="flex items-center gap-4">
            <Phone className="text-blue-600" size={24} />
            <div>
              <p className="text-lg font-medium text-gray-800">Phone</p>
              <p className="text-gray-600">+91 81157 10121</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4">
            <Mail className="text-blue-600" size={24} />
            <div>
              <p className="text-lg font-medium text-gray-800">Email</p>
              <p className="text-gray-600">yogeshkushwaha567@gmail.com</p>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-4">
            <Linkedin className="text-blue-600" size={24} />
            <div>
              <p className="text-lg font-medium text-gray-800">LinkedIn</p>
              <a
                href="https://www.linkedin.com/in/yogesh-kushwaha-aa5557183"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
