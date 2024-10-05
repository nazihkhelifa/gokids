// app/chat/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';
import { Conversation } from "../types";

export default function ConversationDetail({ params }: { params: { id: string } }) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      setIsLoading(true);
      try {
        const conversationRef = doc(db, 'conversations', params.id);
        const conversationSnap = await getDoc(conversationRef);

        if (conversationSnap.exists()) {
          const conversationData = conversationSnap.data() as Conversation;
          console.log("Fetched conversation data:", conversationData);
          setConversation({ id: conversationSnap.id, ...conversationData });
        } else {
          setError("Conversation not found");
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching conversation:", err);
        setError("Failed to fetch conversation. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [params.id]);

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return "N/A";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !conversation) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error || "Conversation not found"}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Link href="/chat" className="text-white hover:text-gray-200 transition-colors duration-300">
            <FaArrowLeft className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-bold">{conversation.user.user_name}</h1>
          <div className="w-6"></div>
        </div>
      </div>
      <div className="p-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-md overflow-hidden p-4">
          {conversation.messages && conversation.messages.length > 0 ? (
            conversation.messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block p-3 rounded-lg ${message.sender === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimestamp(message.timestamp)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No messages in this conversation.</p>
          )}
        </div>
      </div>
    </div>
  );
}