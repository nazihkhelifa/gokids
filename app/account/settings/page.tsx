"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userId = 1; // Replace this with the actual user ID from authentication
  const router = useRouter();

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="bg-white min-h-screen relative">
      {/* Header with back button */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.push('/account')} 
            className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition duration-300 ease-in-out z-10"
          >
            &lt;
          </button>
          <h1 className="text-xl font-bold text-gray-800">My information</h1>
        </div>
      </div>

      {/* User Details */}
      {!loading && userData && (
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="bg-black rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center space-x-4 mb-4">
              {userData.image_url ? (
                <Image
                  src={userData.image_url}
                  alt={userData.user_name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center text-black text-2xl font-semibold">
                  {userData.user_name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{userData.user_name}</h1>
                <p className="text-gray-300">Rating: {userData.user_note} ★</p>
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-4">Parent Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Name</p>
                <p>{userData.user_name}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Age</p>
                <p>{userData.user_age}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Home Address</p>
                <p>{userData.user_home_address}</p>
              </div>
            </div>
          </div>

          {/* Child Information */}
          <div className="bg-black rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Child Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Child's Name</p>
                <p>{userData.user_child_name}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Child's Age</p>
                <p>{userData.user_child_age}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Child's Class Address</p>
                <p>{userData.user_child_class_address}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white z-50">
          <div className="mb-8 text-xl font-semibold">Loading</div>
          <div className="flex flex-col items-center mb-8">
            <div className="w-2 h-2 bg-gray-600 rounded-full mb-2"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full mb-2"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full mb-2"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="text-4xl font-bold">GoKids</div>
        </div>
      )}
    </div>
  );
}