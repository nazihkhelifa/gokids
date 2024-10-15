"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaCar,
  FaChevronRight,
} from "react-icons/fa";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-black">
      {showSplash && (
        <div className="fixed inset-0 bg-blue-600 flex flex-col items-center justify-center z-50 transition-opacity duration-500">
          <h1 className="text-white text-5xl font-bold mb-4">Welcome</h1>
          <p className="text-white text-3xl">Hello, {userData.user_name}!</p>
        </div>
      )}

      <div
        className={`transition-opacity duration-500 ${
          showSplash ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header section */}
        <div className="bg-black text-white p-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {userData.image_url && (
                <img
                  src={userData.image_url}
                  alt={userData.user_name}
                  className="w-16 h-16 rounded-full border-2 border-white mr-4"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">Hi, {userData.user_name}</h1>
                <p className="text-sm mt-1 text-orange-400">Rating: {userData.user_note} ★</p>
              </div>
            </div>
            <Link href="/chat">
              <button className="bg-white text-black py-2 px-5 rounded-full flex items-center text-sm font-semibold transition-all duration-300 hover:bg-gray-200 active:bg-gray-300">
                Chat <FaChevronRight className="ml-2" />
              </button>
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm ">Rides: {userData.available_rides}</p>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {/* Ride Options */}
          <div className="space-y-4 mb-8">
            <Link href="/schedule" className="block">
              <div className="flex items-center bg-white p-6 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md">
                <FaCalendarAlt className="text-2xl text-black mr-6" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Schedule Ride</h3>
                  <p className="text-gray-500 text-sm mt-1">Plan your next trip with ease</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </Link>
            <Link href="/track" className="block">
              <div className="flex items-center bg-white p-6 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md">
                <FaMapMarkedAlt className="text-2xl text-black mr-6" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Track Ride</h3>
                  <p className="text-gray-500 text-sm mt-1">Follow your journey live</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </Link>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Saved Addresses</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaCar className="text-2xl text-black mr-4" />
                <div>
                  <p className="text-gray-500 text-sm">Home</p>
                  <p className="font-semibold">{userData.user_home_address}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaCar className="text-2xl text-black mr-4" />
                <div>
                  <p className="text-gray-500 text-sm">School</p>
                  <p className="font-semibold">{userData.user_child_class_address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}