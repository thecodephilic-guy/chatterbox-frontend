"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useAuthStore } from "@/store/auth-store";
import chatService from "@/services/chat-service";
import { useChatStore } from "@/store/chat-store";
import ChatWindow from "@/components/chat/chat-window";
import useSocket from "@/hooks/useSocket";

function Chats() {
  const setChats = useChatStore((state) => state.setChats);
  const currentUser = useAuthStore((state) => state.data);
  const setChatsLoading = useChatStore((state) => state.setLoading);
  const activeUser = useChatStore((state) => state.activeUser);

  useSocket();
  
  useEffect(() => {
    const fetchChats = async () => {
      setChatsLoading(true);
      if (currentUser?.id) {
        const chats = await chatService.getAllChats(currentUser?.id);
        setChats(chats.chats);
        setChatsLoading(false);
      }
    };
    fetchChats();
  }, [currentUser]);

  //here I have to write logic that if user is authenticated then only allow him to visit this route otherwise redirect him to login route.(later)
  return (
    <>
      <div className="h-full grid grid-cols-1 md:grid-cols-3">
        {/* Chat list sidebar */}
        <div
          className={`overflow-y-auto border-r ${
            activeUser?.id ? "hidden md:block" : "block"
          }`}
        >
          <Sidebar />
        </div>

        {/* Chat area */}
        <div
          className={`${
            activeUser?.id ? "block" : "hidden md:block"
          } md:col-span-2`}
        >
          <ChatWindow />
        </div>
      </div>
    </>
  );
}

export default Chats;
