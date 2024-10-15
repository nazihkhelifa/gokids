"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHome, FaWallet, FaRoute, FaQuestionCircle, FaCog, FaGavel, FaPencilAlt, FaSignOutAlt } from "react-icons/fa";

export default function Account() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userId = 1; // Replace this with the actual user ID from authentication

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

  const menuItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Wallet", path: "/wallet", icon: <FaWallet /> },
    { name: "Track", path: "/track", icon: <FaRoute /> },
    { name: "Help", path: "/help", icon: <FaQuestionCircle /> },
    { name: "Settings", path: "/account/settings", icon: <FaCog /> },
    { name: "Legal", path: "/legal", icon: <FaGavel /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white p-6 pb-24">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">{userData.user_name}</h1>
        <div className="relative w-24 h-24 mx-auto mb-2">
          <Image
            src={userData.image_url || "/placeholder-avatar.png"}
            alt={userData.user_name}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
            <FaPencilAlt className="text-gray-600" />
          </div>
        </div>
        <p className="text-yellow-500">{userData.user_note} ★</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path}>
            <div className="flex flex-col items-center">
              <div className="bg-black text-white rounded-full p-4 mb-2">
                {item.icon}
              </div>
              <span className="text-sm">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <p className="text-center text-gray-500 mt-4">
          Want to be our Driver?
          <br />
          <span className="font-semibold">Open GoKids Driver App</span>
        </p>
        <p className="text-center text-gray-500 mt-4">v.0.1</p>
      </div>

      {/* Bottom Navigation Bar with Red Logout Button */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-30">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="bg-black rounded-full text-white font-bold flex items-center justify-between px-4"
            style={{ width: '280px', height: '55px' }}
          >
            
            <div className="flex items-center space-x-3">
            <span className="text-xl">&lt;</span>
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <span className="text-lg">Home</span>
            </div>
          </Link>
          <button 
            onClick={() => {/* Add logout functionality here */}} 
            className="bg-red-600 p-4 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300"
            style={{ width: '55px', height: '55px' }}
          >
            <FaSignOutAlt className="text-white text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}