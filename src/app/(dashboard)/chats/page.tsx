"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useAuthStore } from "@/store/auth-store";
import chatService from "@/services/chat-service";
import { useChatStore } from "@/store/chat-store";
import ChatWindow from "@/components/chat/chat-window";
import useSocket from "@/hooks/useSocket";
import SocketClient from "@/socket/socket-client";
import { ActiveUsers } from "@/lib/types/user";

function Chats() {
  const setChats = useChatStore((state) => state.setChats);
  const currentUser = useAuthStore((state) => state.data);
  const setChatsLoading = useChatStore((state) => state.setLoading);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setActiveUsers = useChatStore((state) => state.setActiveUsers);
  const { setTypingUsers } = useChatStore();

  useSocket();

  useEffect(() => {
    const socket = SocketClient.getInstance();

    if (!socket) return;

    socket.on("user-typing", (userId) => {
      setTypingUsers(userId, true); // global state update
    });

    socket.on("user-stop-typing", (userId) => {
      setTypingUsers(userId, false); // global state update
    });

    return () => {
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [selectedChat]);

  useEffect(() => {
    const socket = SocketClient.getInstance();

    const handleGetUsers = (users: ActiveUsers[]) => {
      setActiveUsers(users);
    };

    socket.on("get-users", handleGetUsers);

    return () => {
      socket.off("get-users", handleGetUsers);
    };
  }, [currentUser]);

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
            selectedChat?.id ? "hidden md:block" : "block"
          }`}
        >
          <Sidebar />
        </div>

        {/* Chat area */}
        <div
          className={`${
            selectedChat?.id ? "block" : "hidden md:block"
          } md:col-span-2`}
        >
          <ChatWindow />
        </div>
      </div>
    </>
  );
}

export default Chats;
