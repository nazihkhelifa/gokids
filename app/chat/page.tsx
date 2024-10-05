// app/chat/page.tsx
"use client";
import Link from "next/link";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/clientApp';
import { Conversation } from "./types";

export default function ChatList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(conversationsRef, orderBy('lastMessageTime', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        
        const fetchedConversations: Conversation[] = [];
        querySnapshot.forEach((doc) => {
          fetchedConversations.push({ id: doc.id, ...doc.data() } as Conversation);
        });

        setConversations(fetchedConversations);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch conversations. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="text-white hover:text-gray-200 transition-colors duration-300">
            <FaArrowLeft className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-bold">Chats</h1>
          <div className="w-6"></div>
        </div>
      </div>
      {/* Chat list */}
      <div className="p-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          {conversations.map((conversation) => {
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            return (
              <Link key={conversation.conversation_id} href={`/chat/${conversation.conversation_id}`}>
                <div className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <FaUser className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{conversation.user.user_name}</h3>
                    <p className="text-gray-600 text-sm">
                      {lastMessage ? lastMessage.content : "No messages"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {lastMessage ? formatTimestamp(lastMessage.timestamp) : "N/A"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {/* New chat button */}
      <div className="fixed bottom-6 right-6">
        <Link href="/chat/new">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}