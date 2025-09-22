import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Baseurl } from '../main';

const Profile = () => {
  const [userdata, setuserdata] = useState(null);

  const getuser = async () => {
    const userId = localStorage.getItem('userId1');
     
    try {
      const response = await axios.get(`${Baseurl}/getuser/${userId}`,{headers:{"Content-Type":"application/json"}, withCredentials:true,});
      setuserdata(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getuser();
  }, []);

  if (!userdata) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 text-white text-3xl rounded-full flex items-center justify-center font-bold mb-4">
            {userdata.fullname}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{userdata.fullname}</h2>
          <p className="text-gray-500 text-sm mt-1">{userdata.email}</p>
        </div>

        <div className="mt-6 border-t pt-4 space-y-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Contact No.:</span> {userdata.contact}
          </p>
          <p>
            <span className="font-semibold">Contests Given:</span> {userdata.contestgiven?.length || 0}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{' '}
            <span className={`font-semibold ${userdata.role === "ADMIN" ? 'text-green-600' : 'text-blue-600'}`}>
              {userdata.role}
            </span>
            <br />
            <span className=" font-semibold"> Count: {userdata.count>0?userdata.count:0}</span>
            <br />
            <span className=" font-semibold"> Poll: {userdata.poll>0?userdata.poll:0}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
