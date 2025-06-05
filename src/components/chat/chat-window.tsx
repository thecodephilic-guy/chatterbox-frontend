import React from "react";
import ChatHeader from "./chat-header";
import { useChatStore } from "@/store/chat-store";

function ChatWindow() {
  const selectedChat = useChatStore((state) => state.activeUser);
  const isChatLoading = useChatStore((state) => state.loading);

  return (
    <>
      {selectedChat ? (
        <ChatHeader />
      ) : !isChatLoading && (
        <div className="flex h-full items-center justify-center">
          <h1 className="text-2xl text-gray-500 font-medium text-center m-0">
            Select a chat to start the conversation
          </h1>
        </div>
      )}
    </>
  );
}

export default ChatWindow;
