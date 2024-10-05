"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaWallet,
  FaRoute,
  FaQuestionCircle,
  FaCog,
  FaGavel,
  FaChevronRight
} from "react-icons/fa";

export default function Account() {
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
    return <div className="flex justify-center items-center h-screen text-gray-600 font-semibold">Loading...</div>;
  }

  const menuItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Wallet", path: "/wallet", icon: <FaWallet /> },
    { name: "Track", path: "/track", icon: <FaRoute /> },
    { name: "Help", path: "/help", icon: <FaQuestionCircle /> },
    { name: "Settings", path: "/account/settings", icon: <FaCog /> },
    { name: "Legal", path: "/legal", icon: <FaGavel /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-8 rounded-3xl mb-8 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          {userData.image_url && (
            <img
              src={userData.image_url}
              alt={userData.user_name}
              className="w-16 h-16 rounded-full border-2 border-white"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">Hello {userData.user_name}</h1>
            <p className="text-xl font-semibold mt-1">{userData.user_note} ★</p>
          </div>
        </div>

        <p className="mt-6 text-lg">
          Want to be our Driver?
          <br />
          <span className="font-semibold">Open GoKids Driver App</span>
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        {menuItems.map((item, index) => (
          <Link key={item.name} href={item.path}>
            <div className={`py-4 px-6 cursor-pointer hover:bg-gray-50 flex items-center justify-between transition-colors duration-200 ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center space-x-4">
                <span className="text-blue-500 text-xl">{item.icon}</span>
                <span className="text-gray-700 font-medium">{item.name}</span>
              </div>
              <FaChevronRight className="text-gray-400" />
            </div>
          </Link>
        ))}
      </div>

      <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-full mt-8 text-lg font-semibold transition-all duration-300 hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800">
        Logout
      </button>

      <p className="text-center text-gray-500 mt-8">v.0.1</p>
    </div>
  );
}