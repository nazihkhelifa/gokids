// app/chat/new/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from '../../firebase/clientApp';

export default function NewChat() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting to create new conversation...");
      const newConversation = {
        user: {
          user_id: 1,
          user_name: "John Doe",
          user_age: 35,
          user_child_name: "Jane Doe",
          user_child_age: 10,
          user_home_address: "123 Elm Street, Paris",
          user_child_class_address: "456 Oak Avenue, Paris",
          user_note: 4.41,
          available_rides: 10
        },
        driver: {
          id: 1,
          name: "Anil Kumar"
        },
        messages: [
          {
            id: 1,
            sender: "user",
            sender_id: "1",
            sender_name: "John Doe",
            content: message,
            timestamp: Timestamp.fromDate(new Date()), // Use current date instead of serverTimestamp
            type: "text"
          }
        ],
        lastMessageTime: serverTimestamp() // This is fine as it's not inside an array
      };

      console.log("New conversation object:", newConversation);

      const docRef = await addDoc(collection(db, "conversations"), newConversation);
      console.log("New conversation created with ID: ", docRef.id);
      
      router.push(`/chat/${docRef.id}`);
    } catch (err) {
      console.error("Error creating new conversation:", err);
      if (err instanceof Error) {
        setError(`Failed to create new conversation: ${err.message}`);
      } else {
        setError("Failed to create new conversation. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Link href="/chat" className="text-white hover:text-gray-200 transition-colors duration-300">
            <FaArrowLeft className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-bold">New Chat</h1>
          <div className="w-6"></div>
        </div>
      </div>
      <div className="p-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-md overflow-hidden p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Start your conversation
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Start Conversation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}