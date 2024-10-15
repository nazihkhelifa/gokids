"use client";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaUser, FaEdit, FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, Timestamp, where } from 'firebase/firestore';
import { db } from '../firebase/clientApp';
import { Conversation } from "./types";

export default function ChatList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [driverImages, setDriverImages] = useState<{ [key: string]: string }>({});
  const userId = 1; // Placeholder userId for example purposes
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(conversationsRef, orderBy('lastMessageTime', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);

        const fetchedConversations: Conversation[] = [];
        querySnapshot.forEach((doc) => {
          fetchedConversations.push({ id: doc.id, ...doc.data() } as Conversation);
        });

        setConversations(fetchedConversations);

        await Promise.all(
          fetchedConversations.map((conversation) => fetchDriverImage(conversation.driver.id))
        );
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Failed to fetch conversations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchConversations();
    fetchUserData();
  }, []);

  const fetchDriverImage = async (driverId: string) => {
    try {
      const res = await fetch(`/api/drivers/${driverId}`);
      if (!res.ok) throw new Error("Failed to fetch driver data");
      const driverData = await res.json();
      setDriverImages((prevImages) => ({
        ...prevImages,
        [driverId]: driverData.image,
      }));
    } catch (error) {
      console.error("Error fetching driver image:", error);
    }
  };

  const formatTimestamp = (timestamp: Timestamp | string): string => {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid Date";

    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const handleNewChat = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const driverId = 4; // Assuming this is the driver ID you want to check for
      const conversationsRef = collection(db, "conversations");
      const q = query(conversationsRef, where("driver.id", "==", driverId), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingConversation = querySnapshot.docs[0];
        router.push(`/chat/${existingConversation.id}`);
      } else {
        router.push(`/chat/new?userId=${userId}`);
      }
    } catch (err) {
      console.error("Error checking for existing conversation:", err);
      setError("Failed to start a new chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-white text-gray-800">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-white text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen text-gray-200">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-300">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          <button
            onClick={handleNewChat}
            disabled={isLoading}
            className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <FaEdit className="text-lg" />
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div className="container mx-auto p-4">
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <Link key={conversation.id} href={`/chat/${conversation.id}`} className="block">
              <div className="bg-black rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden mr-3">
                      {driverImages[conversation.driver.id] ? (
                        <img
                          src={driverImages[conversation.driver.id]}
                          alt={conversation.driver.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUser className="text-gray-400 text-2xl" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-200">{conversation.driver.name}</h3>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-gray-400 text-sm">{conversation.driver.rating || '4.9'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {formatTimestamp(conversation.lastMessageTime)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm truncate">
                  {conversation.messages && conversation.messages.length > 0
                    ? conversation.messages[conversation.messages.length - 1].content.trim()
                    : "No messages"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}