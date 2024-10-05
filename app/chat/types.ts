// app/chat/types.ts
import { Timestamp } from 'firebase/firestore';

export interface User {
  user_id: number;
  user_name: string;
  user_age: number;
  user_child_name: string;
  user_child_age: number;
  user_home_address: string;
  user_child_class_address: string;
  user_note: number;
  available_rides: number;
}

export interface Message {
  id: number;
  sender: string;
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: Timestamp;
  type: string;
}

export interface Conversation {
  id: string;
  user: User;
  driver: {
    id: number;
    name: string;
  };
  messages: Message[];
  lastMessageTime: Timestamp;
}