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

function ChatWindow() {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const loggedInUserId = useAuthStore((state) => state.data?.id);
  const isChatLoading = useChatStore((state) => state.loading);
  const { chatError, setChatError, updateUnreadCount, updateLastMessage } = useChatStore();

  const {
    messages,
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages,
    shouldScrollToBottom,
    scrollRef,
    addNewMessage,
    setShouldScrollToBottom,
  } = useChatMessages({
    chatId: selectedChat?.chatId,
    onError: setChatError,
  });

  // Mark messages as read when chat is selected
  useEffect(() => {
    const markMessagesRead = async () => {
      if (!selectedChat?.chatId || selectedChat?.unreadCount === 0) return;

      try {
        const response = await chatService.markMessagesRead(selectedChat?.chatId);
        
        if (response.status !== status.OK) {
          throw new Error(response.error);
        }
        if (response.status === status.OK) {
          updateUnreadCount();
        }
      } catch (err) {
        const error = ensureError(err);
        setChatError(error.message);
      }
    };

    if (selectedChat?.chatId) {
      markMessagesRead();
    }
  }, [selectedChat?.chatId, selectedChat?.unreadCount, updateUnreadCount, setChatError]);

  // Handle real-time message reception
  useEffect(() => {
    const socket = SocketClient.init();

    socket.on("message:receive", (response: SocketResponse) => {
      if (response.status !== "OK") {
        setChatError("Message not received due to internal server error");
        return;
      }
      
      const newMessage = response.data[0];
      addNewMessage(newMessage);
      updateLastMessage(newMessage.content);
    });

    return () => {
      socket.off("message:receive");
    };
  }, [setChatError, updateLastMessage, addNewMessage]);

  // Send message function
  const onSendMessage = useCallback((message: string) => {
    if (!selectedChat?.chatId || !message.trim() || !loggedInUserId) return;

    const socket = SocketClient.init();

    try {
      socket.emit(
        "message:send",
        {
          chatId: selectedChat.chatId,
          receiverId: selectedChat.userId,
          content: message,
        },
        (response: SocketResponse) => {
          if (response.status !== "OK") {
            throw new Error("Message not sent due to internal server error");
          }
          
          const newMessage = response.data[0];
          addNewMessage(newMessage);
          updateLastMessage(newMessage.content);
        }
      );
    } catch (err) {
      const error = ensureError(err);
      setChatError(error.message);
    }
  }, [selectedChat?.chatId, selectedChat?.userId, loggedInUserId, addNewMessage, updateLastMessage, setChatError]);

  // Show empty state when no chat is selected
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
      {/* Header */}
      <div className="shrink-0">
        <ChatHeader />
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto w-full px-4 py-6"
        id="chat-area"
        ref={scrollRef}
      >
        {/* Loading initial messages */}
        {loadingMessages && (
          <p className="text-center text-sm text-gray-400">
            Loading messages...
          </p>
        )}

        {/* Error state */}
        {chatError && (
          <p className="text-center text-sm text-red-500">{chatError}</p>
        )}

        {/* Messages */}
        {!loadingMessages && !chatError && (
          <div className="flex flex-col space-y-2 min-h-full justify-end">
            {/* Loading more messages indicator */}
            {loadingMoreMessages && (
              <div className="text-center text-sm text-gray-400 py-2">
                Loading more messages...
              </div>
            )}
            
            {/* No more messages indicator */}
            {!hasMoreMessages && messages.length > 0 && (
              <div className="text-center text-sm text-gray-400 py-2">
                No more messages
              </div>
            )}

            {/* Message list */}
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

      {/* Input Area */}
      <div className="shrink-0 border-t px-4 py-3 w-full">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}

export default ChatWindow;