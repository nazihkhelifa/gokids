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
  const [userData, setUserData] = useState<any>(null);
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-blue-600">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {showSplash && (
        <div className="fixed inset-0 bg-gradient-to-r from-blue-400 to-blue-600 flex flex-col items-center justify-center z-50 transition-opacity duration-500">
          <h1 className="text-white text-5xl font-bold mb-4">Welcome</h1>
          <p className="text-white text-3xl">Hello, {userData.user_name}!</p>
        </div>
      )}

      <div
        className={`transition-opacity duration-500 ${
          showSplash ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-8 pb-16 w-full rounded-b-[3rem] shadow-lg">
          <div className="flex flex-col items-center mb-8">
            {userData.image_url && (
              <img
                src={userData.image_url}
                alt={userData.user_name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-6"
              />
            )}
            <h1 className="text-4xl font-bold text-center">
              Hello, {userData.user_name}
            </h1>
            <p className="text-2xl mt-2 font-semibold">{userData.user_note} ★</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold">
              Available Rides: {userData.available_rides}
            </p>
            <Link href="/chat">
              <button className="bg-white text-blue-500 py-3 px-6 rounded-full flex items-center text-lg font-semibold transition-all duration-300 hover:bg-gray-100 active:bg-gray-200">
                Messages <FaChevronRight className="ml-2" />
              </button>
            </Link>
          </div>
        </div>

        <div className="p-6 -mt-8">
          {/* Ride Options */}
          <div className="space-y-4 mb-8">
            <Link href="/schedule" className="block">
              <div className="flex items-center bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
                <FaCalendarAlt className="text-4xl text-blue-500 mr-6" />
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-gray-800">Schedule Ride</h3>
                  <p className="text-gray-600 mt-1">Plan your next trip</p>
                </div>
                <FaChevronRight className="text-gray-400 text-xl" />
              </div>
            </Link>
            <Link href="/track" className="block">
              <div className="flex items-center bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
                <FaMapMarkedAlt className="text-4xl text-blue-500 mr-6" />
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-gray-800">Track Current Ride</h3>
                  <p className="text-gray-600 mt-1">
                    Follow your ongoing journey
                  </p>
                </div>
                <FaChevronRight className="text-gray-400 text-xl" />
              </div>
            </Link>
          </div>

          {/* Addresses */}
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
            <h3 className="font-semibold text-xl text-gray-800 mb-4">Saved Addresses</h3>
            <div className="flex items-center">
              <FaCar className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-gray-600">Home Address</p>
                <p className="font-semibold text-lg mt-1">{userData.user_home_address}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCar className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-gray-600">Class Address</p>
                <p className="font-semibold text-lg mt-1">
                  {userData.user_child_class_address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}