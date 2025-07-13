import React, { useEffect, useCallback } from "react";
import ChatHeader from "./chat-header";
import { useChatStore } from "@/store/chat-store";
import ChatInput from "./chat-input";
import MessageBox from "./message-box";
import SocketClient from "@/socket/socket-client";
import { useAuthStore } from "@/store/auth-store";
import ensureError from "@/lib/utils/ensureError";
import status from "http-status";
import { SocketResponse } from "@/socket/socket-events";
import { useChatMessages } from "@/hooks/useChatMessages";
import chatService from "@/services/chat-service";
import { Message } from "@/lib/types/chat";

function ChatWindow() {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const selectedNewChat = useChatStore((state) => state.selectedNewChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const setSelectedNewChat = useChatStore((state) => state.setSelectedNewChat);
  const setChats = useChatStore((state) => state.setChats);
  const loggedInUserId = useAuthStore((state) => state.data?.id);
  const isChatLoading = useChatStore((state) => state.loading);
  const { chatError, setChatError, updateUnreadCount, updateLastMessage, setNewChatUsers } = useChatStore();

  const activeChat = selectedChat || selectedNewChat;

  const {
    messages,
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages,
    scrollRef,
    addNewMessage,
    setShouldScrollToBottom,
    clearMessages,
  } = useChatMessages({
    chatId: selectedChat?.chatId, // Only pass if existing chat
    onError: setChatError,
  });

  // Mark as read when existing chat is selected
  useEffect(() => {
    const markMessagesRead = async () => {
      if (!selectedChat?.chatId || selectedChat?.unreadCount === 0) return;

      try {
        const response = await chatService.markMessagesRead(selectedChat.chatId);
        if (response.status !== status.OK) throw new Error(response.error);
        updateUnreadCount();
      } catch (err) {
        setChatError(ensureError(err).message);
      }
    };

    if (selectedChat?.chatId) markMessagesRead();
  }, [selectedChat?.chatId, selectedChat?.unreadCount, updateUnreadCount, setChatError]);

  // Clear messages when a new chat is started
  useEffect(() => {
    if (selectedNewChat) {
      clearMessages();
    }
  }, [selectedNewChat, clearMessages]);

  // Real-time
  useEffect(() => {
  const socket = SocketClient.init();

  socket.on("message:receive", async (response: SocketResponse) => {
    if (response.status !== "OK") {
      setChatError("Message not received due to internal server error");
      return;
    }

    const newMessage = response.data[0];

    // Your existing logic to handle "new chat started by sender"
    if (selectedNewChat && newMessage.chatId) {
      setSelectedChat({
        chatId: newMessage.chatId,
        userId: selectedNewChat.userId,
        name: selectedNewChat.name,
        gender: selectedNewChat.gender,
        lastMessage: newMessage.content,
        lastMessageType: newMessage.messageType,
        messageTime: newMessage.createdAt,
        unreadCount: 0,
      });
      setSelectedNewChat(null);
    }

    // 👇 Check if this chatId is in the current chats list
    const currentChats = useChatStore.getState().chats || [];
    const chatExists = currentChats.some((c) => c.chatId === newMessage.chatId);

    if (!chatExists) {
      // This means receiver got first message in a new chat
      try {
        const chatsResponse = await chatService.getAllChats();
        setChats(chatsResponse.data);
      } catch (e) {
        console.error("Failed to refresh chats", e);
      }
    }

    addNewMessage(newMessage);
    updateLastMessage(newMessage.content);
  });

  return () => {
    socket.off("message:receive");
  };
}, [
  selectedNewChat,
  setSelectedChat,
  setSelectedNewChat,
  addNewMessage,
  updateLastMessage,
  setChatError,
  setChats,
]);

  const onSendMessage = useCallback(
    (message: string) => {
      if (!message.trim() || !loggedInUserId || !activeChat?.userId) return;

      const socket = SocketClient.init();

      try {
        socket.emit(
          "message:send",
          {
            chatId: selectedChat?.chatId,
            receiverId: activeChat.userId,
            content: message,
          },
          (response: SocketResponse) => {
            if (response.status !== "OK") {
              throw new Error("Message not sent due to internal server error");
            }

            const newMessage: Message = response.data[0];

            if (selectedNewChat && newMessage.chatId) {
              setSelectedChat({
                chatId: newMessage.chatId,
                userId: selectedNewChat.userId,
                name: selectedNewChat.name,
                gender: selectedNewChat.gender,
                lastMessage: newMessage.content,
                lastMessageType: newMessage.messageType,
                messageTime: newMessage.createdAt,
                unreadCount: 0,
              });
              setSelectedNewChat(null);
            }
            setNewChatUsers([]);
            addNewMessage(newMessage);
            updateLastMessage(newMessage.content);
          }
        );
      } catch (err) {
        setChatError(ensureError(err).message);
      }
    },
    [
      selectedChat?.chatId,
      activeChat?.userId,
      loggedInUserId,
      selectedNewChat,
      setSelectedChat,
      setSelectedNewChat,
      addNewMessage,
      updateLastMessage,
      setChatError,
    ]
  );

  if (!activeChat && !isChatLoading) {
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
      <div className="flex-1 overflow-y-auto w-full px-4 py-6" ref={scrollRef}>
        {loadingMessages && (
          <p className="text-center text-sm text-gray-400">Loading messages...</p>
        )}
        {chatError && (
          <p className="text-center text-sm text-red-500">{chatError}</p>
        )}
        {!loadingMessages && !chatError && (
          <div className="flex flex-col space-y-2 min-h-full justify-end">
            {loadingMoreMessages && (
              <div className="text-center text-sm text-gray-400 py-2">
                Loading more messages...
              </div>
            )}
            {!hasMoreMessages && messages.length > 0 && (
              <div className="text-center text-sm text-gray-400 py-2">
                No more messages
              </div>
            )}
            {messages.map((message) => (
              <MessageBox
                key={message.id}
                content={message.content}
                timestamp={message.createdAt}
                isOwnMessage={message.senderId === loggedInUserId}
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