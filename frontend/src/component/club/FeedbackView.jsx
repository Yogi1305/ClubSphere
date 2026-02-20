
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Baseurl } from '../../main';
import { toast } from 'react-toastify';

const FeedbackView = ({ club }) => {
  console.log('FeedbackView club:', club);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const UserId = localStorage.getItem('userId1');
        const res = await axios.get(
          `${Baseurl}/event/feedback/${club}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-User-Id': UserId,
            },
            
            withCredentials: true,
          }
        );
        setFeedbacks(res.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };
    if (club) fetchFeedbacks();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Club Feedbacks</h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center text-gray-500">No feedback found for this club.</div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="border rounded p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{fb.title}</span>
                <span className="text-xs text-gray-500">{fb.type}</span>
              </div>
              <div className="mb-2 text-gray-700">{fb.description}</div>
              <div className="text-xs text-gray-400">{fb.createdAt ? new Date(fb.createdAt).toLocaleString() : ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackView;