"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useChatStore } from "@/store/chat-store";
import ChatWindow from "@/components/chat/chat-window";
import SocketClient from "@/socket/socket-client";
import status from "http-status";
import { redirect } from "next/navigation";
import { ChatResponse } from "@/lib/types/chat";
import chatService from "@/services/chat-service";
import ensureError from "@/lib/utils/ensureError";

function Chats() {
  const { selectedChat, setActiveUsers, setChats } =
    useChatStore();
  const loggedInUser = useAuthStore((state) => state.data);
  const { setAuthError } = useAuthStore();
  const socket = SocketClient.init();

  useEffect(() => {
    socket.connect();
    socket.on("users:active", (response) => {
      if (response.status === "OK") {
        setActiveUsers(response.data);
      }
    });
    return () => {
      socket.off("users:active");
      socket.disconnect();
    };
  }, [loggedInUser]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats: ChatResponse = await chatService.getAllChats();
        setChats(chats.data);
      } catch (e) {
        setAuthError((e as Error).message);
        redirect("/login");
      }
    };
    fetchChats();
  }, [loggedInUser]);

  // useEffect(() => {
  //   const socket = SocketClient.getInstance();

  //   if (!socket) return;

  //   socket.on("user-typing", (userId) => {
  //     setTypingUsers(userId, true); // global state update
  //   });

  //   socket.on("user-stop-typing", (userId) => {
  //     setTypingUsers(userId, false); // global state update
  //   });

  //   return () => {
  //     socket.off("user-typing");
  //     socket.off("user-stop-typing");
  //   };
  // }, [selectedChat]);

  //here I have to write logic that if user is authenticated then only allow him to visit this route otherwise redirect him to login route.(later)
  return (
    <>
      <div className="h-full grid grid-cols-1 md:grid-cols-3">
        {/* Chat list sidebar */}
        <div
          className={`overflow-y-auto border-r ${
            selectedChat?.chatId ? "hidden md:block" : "block"
          }`}
        >
          <Sidebar />
        </div>

        {/* Chat area */}
        <div
          className={`${
            selectedChat?.chatId ? "block" : "hidden md:block"
          } md:col-span-2`}
        >
          <ChatWindow />
        </div>
      </div>
    </>
  );
}

export default Chats;
