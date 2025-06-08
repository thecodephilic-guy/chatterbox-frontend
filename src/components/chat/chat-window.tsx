import React from "react";
import ChatHeader from "./chat-header";
import { useChatStore } from "@/store/chat-store";
import ChatInput from "./chat-input";

function ChatWindow() {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const isChatLoading = useChatStore((state) => state.loading);

  return (
    <>
      {selectedChat ? (
        <>
          <div className="flex flex-col h-screen">
            <div className="shrink-0">
              <ChatHeader />
            </div>
            <div className="flex-1 overflow-y-auto w-full px-4 py-6" id="chat-area">
              {/* Chat messages will be rendered here */}
              <div className="text-gray-300 text-center">
                This is the chat area where complete chat will be displayed
              </div>
              {/* Implement infinite scroll logic here */}
            </div>
            <div className="shrink-0 border-t px-4 py-3">
              <ChatInput />
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
