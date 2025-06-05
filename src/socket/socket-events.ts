
export interface ServerToClientEvents {
  'get-users': (users: []) => void;
  'receive-message': (message: Message) => void;
  'user-typing': (userId: string) => void;
  'user-stop-typing': (userId: string) => void;
}

export interface ClientToServerEvents {
  'add-new-user': (userId: string) => void;
  'send-message': (data: SendMessagePayload) => void;
  'user-typing': (data: TypingPayload) => void;
  'user-stop-typing': (data: TypingPayload) => void;
}

// Define additional interfaces as needed
export interface ActiveUser {
  userId: string;
  socketId: string;
  isTyping?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'video'; 
  createdAt: string;
  isRead: boolean;
}

export interface SendMessagePayload {
  receiverId: string;
  chatId: string;
  senderId: string;
  message: string;
}

export interface TypingPayload {
  userId: string;
  receiverId: string;
}