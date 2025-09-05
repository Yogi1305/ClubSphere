import React, { useState } from 'react';
import { Send, Users, UserCheck } from 'lucide-react';
import axios from 'axios';
import { Baseurl } from '../../main';
import { toast } from 'react-toastify';

const Notification = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    sendTo: 'all' // 'all' or 'members'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Replace with your actual API endpoint and base URL
      const response = await axios.post(`${Baseurl}/event/notifications/send/${formData.sendTo}`, {
        title: formData.title,
        body: formData.body,
       
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      console.log('Notification sent successfully:', response.data);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        body: '',
        sendTo: 'all'
      });
      
      toast.success('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Send className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Send Notification</h2>
      </div>
      
      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Notification Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter notification title..."
          />
        </div>

        {/* Body Field */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Message Body
          </label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter your message..."
          />
        </div>

        {/* Send To Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Send To
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="sendToAll"
                name="sendTo"
                value="all"
                checked={formData.sendTo === 'all'}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="sendToAll" className="ml-3 flex items-center cursor-pointer">
                <Users className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm text-gray-900">Send to All Users</span>
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="sendToMembers"
                name="sendTo"
                value="members"
                checked={formData.sendTo === 'members'}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="sendToMembers" className="ml-3 flex items-center cursor-pointer">
                <UserCheck className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm text-gray-900">Send to Club Members Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setFormData({ title: '', body: '', sendTo: 'all' })}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Clear
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !formData.title.trim() || !formData.body.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? 'Sending...' : 'Send Notification'}</span>
          </button>
        </div>
      </div>

      {/* Form Preview */}
      {(formData.title || formData.body) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">
                {formData.title || 'Notification Title'}
              </h4>
              <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                {formData.sendTo === 'all' ? 'To: All Users' : 'To: Members Only'}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {formData.body || 'Your message will appear here...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;