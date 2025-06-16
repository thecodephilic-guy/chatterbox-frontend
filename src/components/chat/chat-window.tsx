import React, { useEffect, useState, useRef } from "react";
import ChatHeader from "./chat-header";
import { useChatStore } from "@/store/chat-store";
import ChatInput from "./chat-input";
import MessageBox from "./message-box";
import chatService from "@/services/chat-service";
import { MessageResponse, Message } from "@/lib/types/chat";
import SocketClient from "@/socket/socket-client";
import { useAuthStore } from "@/store/auth-store";

function ChatWindow() {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const currentUserId = useAuthStore((state) => state.data?.id);
  const isChatLoading = useChatStore((state) => state.loading);

  const [allMessages, setAllMessages] = useState<Message[] | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(true); // ✅ Added loading state
  const [fetchError, setFetchError] = useState(""); // ✅ Error handling

  const scrollRef = useRef<HTMLDivElement>(null); // ✅ For scrolling to bottom on new messages

  // ✅ Fetch messages for the selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = (await chatService.getMessages(
          selectedChat?.chatId
        )) as MessageResponse;
        setAllMessages(response.data);
        setFetchError("");
      } catch (err) {
        setFetchError("Failed to load messages.");
      } finally {
        setLoadingMessages(false);
      }
    };

    if (selectedChat?.chatId) {
      fetchMessages();
    }
  }, [selectedChat?.chatId]);

  // ✅ Socket setup (only on mount)
  useEffect(() => {
    const socket = SocketClient.getInstance();

    const handleReceiveMessage = (data: any) => {
      // Convert createdAt to Date if it's a string
      const message: Message = {
        ...data,
        createdAt:
          typeof data.createdAt === "string"
            ? new Date(data.createdAt)
            : data.createdAt,
      };
      setAllMessages((prev) => [...(prev ?? []), message]);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, []); // ✅ Changed from [newMessage] to [] to avoid unnecessary resets

  // ✅ Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages]);

  // ✅ Sending a new message
  const onSendMessage = (message: string) => {
    if (!selectedChat?.chatId || !message.trim() || !currentUserId) return;

    const socket = SocketClient.getInstance();

    socket.emit("send-message", {
      chatId: selectedChat.chatId,
      receiverId: selectedChat.userId,
      senderId: currentUserId,
      message,
    });
  };

  // ✅ Loading or No Chat Selected UI
  if (!selectedChat && !isChatLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-2xl text-gray-500 font-medium text-center m-0">
          Select a chat to start the conversation
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="shrink-0">
        <ChatHeader />
      </div>

      <div
        className="flex-1 overflow-y-auto w-full px-4 py-6"
        id="chat-area"
        ref={scrollRef}
      >
        {loadingMessages && (
          <p className="text-center text-sm text-gray-400">
            Loading messages...
          </p>
        )}

        {fetchError && (
          <p className="text-center text-sm text-red-500">{fetchError}</p>
        )}

        {!loadingMessages && !fetchError && (
          <div className="flex flex-col space-y-2">
            {allMessages?.map((message) => (
              <MessageBox
                key={message.id}
                content={message.content}
                timestamp={message.createdAt}
                isOwnMessage={message.senderId === currentUserId} // ✅ Cleaner check
              />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t px-4 py-3 w-full">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}

export default ChatWindow;
