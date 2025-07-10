
export interface Chat {
  chatId: string;
  userId: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  lastMessage: string;
  lastMessageType: string;
  messageTime: Date;
  unreadCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: string;
  createdAt: Date;
  isRead: boolean;
}

export interface ChatResponse {
  status: number;
  message: string;
  error?: string;
  data: any;
}