"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useAuthStore } from "@/store/auth-store";
import chatService from "@/services/chat-service";
import { useChatStore } from "@/store/chat-store";

function Chats() {
  const setChats = useChatStore((state) => state.setChats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const currentUser = useAuthStore((state) => state.data);

  useEffect(() => {
    const fetchChats = async () => {
      if (currentUser?.id) {
        const chats = await chatService.getAllChats(currentUser?.id);
        setChats(chats.chats);
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
            selectedChatId ? "hidden md:block" : "block"
          }`}
        >
          <Sidebar />
        </div>

        {/* Chat area */}
        <div
          className={`${
            selectedChatId ? "block" : "hidden md:block"
          } md:col-span-2`}
        ></div>
      </div>
    </>
  );
}

export default Chats;
