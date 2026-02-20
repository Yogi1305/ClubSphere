

import React, { useState } from 'react';
import axios from 'axios';
import { Baseurl } from '../../main';
import { toast } from 'react-toastify';


const Feedback = ({ club }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('General');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const UserId = localStorage.getItem('userId1');
      const res = await axios.post(
        `${Baseurl}/event/feedback`,
        {
          title,
          type,
          description,
          club,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': UserId,
          },
          withCredentials: true,
        }
      );
      toast.success(res.data.message || 'Feedback submitted!');
      setTitle('');
      setType('General');
      setDescription('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            className="w-full border rounded p-2"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter feedback title"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            className="w-full border rounded p-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="General">General</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Complaint">Complaint</option>
            <option value="Appreciation">Appreciation</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border rounded p-2 min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Write your feedback here..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default Feedback;
