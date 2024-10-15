// app/chat/[id]/page.tsx
"use client"; 
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { FaRegSmile, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { doc, updateDoc, arrayUnion, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';
import { Conversation, Message } from "../types";
import EmojiPicker from 'emoji-picker-react';

export default function ConversationDetail({ params }: { params: { id: string } }) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [driverImage, setDriverImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editedMessageContent, setEditedMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const conversationRef = doc(db, 'conversations', params.id);

    const unsubscribe = onSnapshot(conversationRef, (doc) => {
      if (doc.exists()) {
        setConversation({ id: doc.id, ...doc.data() } as Conversation);
      } else {
        setError("Conversation not found");
      }
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching conversation:", err);
      setError("Failed to fetch conversation. Please try again later.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [params.id]);

  useEffect(() => {
    if (conversation?.user?.user_id) {
      fetch(`/api/user?id=${conversation.user.user_id}`)
        .then(res => res.json())
        .then(data => setUserImage(data.image_url))
        .catch(err => console.error("Error fetching user image:", err));
    }

    if (conversation?.driver?.id) {
      fetch(`/api/drivers/${conversation.driver.id}`)
        .then(res => res.json())
        .then(data => setDriverImage(data.image))
        .catch(err => console.error("Error fetching driver image:", err));
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return "N/A";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateDivider = (timestamp: any): string => {
    if (!timestamp) return "N/A";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversation || !newMessage.trim()) return;

    setIsSending(true);
    try {
      const newMessageObj: Message = {
        id: conversation.messages.length + 1,
        sender: "user",
        sender_id: conversation.user.user_id.toString(),
        sender_name: conversation.user.user_name,
        content: newMessage.trim(),
        timestamp: Timestamp.fromDate(new Date()),
        type: "text",
        isEdited: false
      };

      const conversationRef = doc(db, 'conversations', conversation.id);
      await updateDoc(conversationRef, {
        messages: arrayUnion(newMessageObj),
        lastMessageTime: Timestamp.fromDate(new Date())
      });

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
    if (!showEmojiPicker) {
      inputRef.current?.focus();
    }
  };

  const handleEditMessage = (messageId: number, content: string) => {
    setEditingMessageId(messageId);
    setEditedMessageContent(content);
  };

  const handleSaveEdit = async () => {
    if (!conversation || editingMessageId === null) return;

    try {
      const updatedMessages = conversation.messages.map(msg => 
        msg.id === editingMessageId 
          ? { ...msg, content: editedMessageContent, isEdited: true } 
          : msg
      );

      const conversationRef = doc(db, 'conversations', conversation.id);
      await updateDoc(conversationRef, {
        messages: updatedMessages
      });

      setEditingMessageId(null);
      setEditedMessageContent("");
    } catch (err) {
      console.error("Error updating message:", err);
      setError("Failed to update message. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedMessageContent("");
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !conversation) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error || "Conversation not found"}</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-gray-100 h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center border-b">
        <Link href="/chat">
          <IoArrowBack className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold ml-4">Messages Detail</h1>
        <div className="ml-auto bg-gray-200 rounded-full w-8 h-8">
          {driverImage && (
            <img src={driverImage} alt={conversation.driver.name} className="w-8 h-8 rounded-full" />
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((message, index) => {
            const isUserMessage = message.sender === "user";
            const isNewDay = index === 0 || 
              formatDateDivider(conversation.messages[index - 1].timestamp) !== formatDateDivider(message.timestamp);
            
            return (
              <div key={message.id} className="space-y-2">
                {isNewDay && (
                  <div className="text-center text-xs text-gray-500 my-4">
                    {formatDateDivider(message.timestamp)}
                  </div>
                )}
                <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} items-center`}>
                  {!isUserMessage && (
                    <div className="bg-gray-200 rounded-full w-8 h-8 mr-2">
                      {driverImage && (
                        <img src={driverImage} alt={conversation.driver.name} className="w-8 h-8 rounded-full" />
                      )}
                    </div>
                  )}
                  {isUserMessage && (
                    <p className="text-[10px] text-gray-400 mr-2 self-center">{formatTimestamp(message.timestamp)}</p>
                  )}
                  <div 
                    className={`p-2 max-w-xs ${
                      isUserMessage 
                        ? 'bg-[#567AF3] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                        : 'bg-white rounded-tl-lg rounded-tr-lg rounded-br-lg'
                    }`}
                  >
                    {editingMessageId === message.id ? (
                      <div>
                        <textarea
                          value={editedMessageContent}
                          onChange={(e) => setEditedMessageContent(e.target.value)}
                          className="w-full p-2 text-black rounded"
                        />
                        <div className="flex justify-end mt-2">
                          <button onClick={handleSaveEdit} className="mr-2 text-green-500">
                            <FaCheck />
                          </button>
                          <button onClick={handleCancelEdit} className="text-red-500">
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                          {message.content}
                          {isUserMessage && (
                            <button 
                              onClick={() => handleEditMessage(message.id, message.content)}
                              className="ml-2 text-xs opacity-50 hover:opacity-100"
                            >
                              <FaEdit />
                            </button>
                          )}
                        </p>
                        {message.isEdited && (
                          <p className="text-xs italic opacity-50 mt-1">
                            Edited
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {!isUserMessage && (
                    <p className="text-[10px] text-gray-400 ml-2 self-center">{formatTimestamp(message.timestamp)}</p>
                  )}
                  {isUserMessage && (
                    <div className="bg-gray-200 rounded-full w-8 h-8 ml-2">
                      {userImage && (
                        <img src={userImage} alt={conversation.user.user_name} className="w-8 h-8 rounded-full" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No messages in this conversation.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white p-4 relative">
        <form onSubmit={handleSendMessage} className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <button
            type="button"
            className="text-gray-400 mr-2"
            onClick={toggleEmojiPicker}
          >
            <FaRegSmile className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-16 left-0 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a Message..."
            className="flex-1 bg-transparent focus:outline-none"
          />
          {newMessage.trim() ? (
            <button
              type="submit"
              className="text-blue-500 ml-2"
              disabled={isSending}
            >
              <IoMdSend className="w-5 h-5" />
            </button>
          ) : null}
        </form>
      </div>
    </div>
  );
}