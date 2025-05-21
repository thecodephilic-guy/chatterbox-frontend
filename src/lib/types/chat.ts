import { User } from './user';

export interface Message {
  id: string;
  content: string;
  chatId: string;
  senderId: string;
  sender?: User;
  createdAt: string;
  updatedAt?: string;
  readBy?: string[];
}

export interface Chat {
  id: string;
  name?: string;
  isGroupChat: boolean;
  participants: User[];
  createdBy: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}