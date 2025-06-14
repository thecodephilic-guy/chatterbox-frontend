
export interface Chat {
  chatId: string;
  userId: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  lastMessage: string;
  updatedAt?: string; 
  unreadCount: number;
}

export interface ChatResponse {
  status: number;
  message: string;
  chats: Chat[];
}