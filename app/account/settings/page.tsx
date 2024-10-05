"use client";

import { useEffect, useState } from "react";

export default function Settings() {
  const [userData, setUserData] = useState<any>(null);
  const userId = 1; // Replace this with the actual user ID from authentication

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user?userId=${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const user = await res.json();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <div className="flex items-center space-x-4">
      {userData.image_url ? (
        <img
          src={userData.image_url}
          alt={userData.user_name}
          className="w-16 h-16 rounded-full"
        />
      ) : (
        <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
          {userData.user_name.charAt(0)}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold">{userData.user_name}</h1>
        <p className="text-gray-500">Rating: {userData.user_note} ★</p>
      </div>
    </div>
  </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Personal Information
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Name</p>
            <p className="text-gray-900">{userData.user_name}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Age</p>
            <p className="text-gray-900">{userData.user_age}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Child's Name</p>
            <p className="text-gray-900">{userData.user_child_name}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Child's Age</p>
            <p className="text-gray-900">{userData.user_child_age}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Addresses</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Home Address</p>
            <p className="text-gray-900">{userData.user_home_address}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Child Class</p>
            <p className="text-gray-900">{userData.user_child_class_address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
