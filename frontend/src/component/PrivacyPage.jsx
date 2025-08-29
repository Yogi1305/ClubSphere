import React, { useState } from 'react';
import { Shield, Eye, Lock, Users, FileText, Mail, Calendar, ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react';

const PrivacyPage = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Personal Information</h4>
            <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Name and email address when you create an account</li>
              <li>• Profile information you choose to provide</li>
              <li>• Payment information for premium features</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Quiz Data</h4>
            <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Quiz content you create (questions, answers, media)</li>
              <li>• Quiz responses and results from participants</li>
              <li>• Performance analytics and usage statistics</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Technical Information</h4>
            <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• IP address and device information</li>
              <li>• Browser type and version</li>
              <li>• Usage patterns and feature interactions</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Data',
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Service Provision</h4>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>We use your information to provide, maintain, and improve Quizzy's quiz creation and management features.</p>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Communication</h4>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>We may send you service updates, security alerts, and feature announcements related to your account.</p>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Analytics</h4>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>We analyze usage patterns to improve our platform and develop new features that better serve our users.</p>
          </div>
        </div>
      )
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing & Disclosure',
      icon: <Eye className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/50 border border-blue-800' : 'bg-blue-50'}`}>
            <p className={`font-medium ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>We do not sell your personal information to third parties.</p>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Limited Sharing</h4>
            <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Service providers who help us operate Quizzy (hosting, analytics)</li>
              <li>• Legal requirements or to protect our rights</li>
              <li>• Business transfers (with user notification)</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Quiz Participants</h4>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>When you conduct a quiz, participant responses are shared with you as the quiz creator. Participants are informed of this when taking quizzes.</p>
          </div>
        </div>
      )
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Security Measures</h4>
            <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• SSL encryption for data transmission</li>
              <li>• Secure data storage with encryption at rest</li>
              <li>• Regular security audits and updates</li>
              <li>• Access controls and authentication</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Your Responsibility</h4>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Please keep your account credentials secure and notify us immediately of any unauthorized access.</p>
          </div>
        </div>
      )
    },
    {
      id: 'user-rights',
      title: 'Your Rights & Choices',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Data Access & Control</h4>
            <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Access and download your data</li>
              <li>• Correct inaccurate information</li>
              <li>• Delete your account and data</li>
              <li>• Restrict processing of your data</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Communication Preferences</h4>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>You can opt out of marketing communications while still receiving essential service notifications.</p>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Data Portability</h4>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>You can export your quiz data in standard formats for use elsewhere.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quizzy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Last updated: June 2025
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Policy</h2>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            At Quizzy, we're committed to protecting your privacy while helping you create and conduct engaging online quizzes. 
            This policy explains how we collect, use, and safeguard your information.
          </p>
        </div>

        {/* Quick Overview */}
        <div className={`rounded-xl shadow-lg p-8 mb-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Privacy at a Glance</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 ${
                darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'
              }`}>
                <Lock className="w-6 h-6" />
              </div>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Secure by Design</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your data is encrypted and protected with industry-standard security measures.</p>
            </div>
            <div className="text-center">
              <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 ${
                darkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600'
              }`}>
                <Eye className="w-6 h-6" />
              </div>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transparent Usage</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>We clearly explain how your information is used to improve your experience.</p>
            </div>
            <div className="text-center">
              <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 ${
                darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                <Users className="w-6 h-6" />
              </div>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Control</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>You have full control over your data with easy access, export, and deletion options.</p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full px-8 py-6 text-left flex items-center justify-between transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600">
                    {section.icon}
                  </div>
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{section.title}</h3>
                </div>
                {expandedSection === section.id ? (
                  <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                )}
              </button>
              {expandedSection === section.id && (
                <div className={`px-8 pb-6 border-t transition-colors duration-300 ${
                  darkMode ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <div className="pt-6">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className={`rounded-xl shadow-lg p-8 mt-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Questions About Privacy?</h3>
          </div>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            We're here to help! If you have any questions about this privacy policy or how we handle your data, 
            please don't hesitate to reach out to our privacy team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:privacy@quizzy.com"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              Contact Privacy Team
            </a>
            <a
              href="mailto:support@quizzy.com"
              className={`px-6 py-3 rounded-lg transition-colors text-center font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              General Support
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-12 pt-8 border-t transition-colors duration-300 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            © 2025 Quizzy. All rights reserved. This privacy policy is effective as of June 2025.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;