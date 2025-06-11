import React from "react";
import ChatHeader from "./chat-header";
import { useChatStore } from "@/store/chat-store";
import ChatInput from "./chat-input";
import MessageBox from "./message-box";
import userService from "@/services/user-service";

function ChatWindow() {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const isChatLoading = useChatStore((state) => state.loading);
  const onSendMessage = () => {};

  return (
    <>
      {selectedChat ? (
        <>
          <div className="flex flex-col h-screen">
            <div className="shrink-0">
              <ChatHeader />
            </div>
            <div
              className="flex-1 overflow-y-auto w-full px-4 py-6"
              id="chat-area"
            >
              <div className="flex flex-col space-y-2">
                <MessageBox
                  message="Hello, how are you?"
                  senderName="John"
                  timestamp="10:45 AM"
                  isOwnMessage={false}
                />

                <MessageBox
                  message="I'm good, thanks! What about you?"
                  timestamp="10:46 AM"
                  isOwnMessage={true}
                />
              </div>
              {/* Implement infinite scroll logic here */}
            </div>
            <div className="hrink-0 border-t px-4 py-3 w-full">
              <ChatInput onSendMessage={onSendMessage} />
            </div>
          </div>
        </>
      ) : (
        !isChatLoading && (
          <div className="flex h-full items-center justify-center">
            <h1 className="text-2xl text-gray-500 font-medium text-center m-0">
              Select a chat to start the conversation
            </h1>
          </div>
        )
      )}
    </>
  );
}

export default ChatWindow;
