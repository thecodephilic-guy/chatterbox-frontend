export interface ServerToClientEvents {
  "message:receive": (response: SocketResponse) => void;
  "users:active": (response: SocketResponse) => void;
  "users:typing": (response: SocketResponse) => void;
}

export interface ClientToServerEvents {
  "message:send": (
    paylaod: MessagePayload,
    callback: (response: SocketResponse) => void
  ) => void;

  "user:typing": (payload: TypingPayload) => void
}

export interface SocketResponse {
  status: string;
  message: string;
  error?: string;
  data: any;
}

interface MessagePayload {
  chatId: string;
  receiverId: string;
  content: string;
  messageType?: "text" | "image" | "video";
}

interface TypingPayload {
  senderId: string;
  receiverId: string;
}