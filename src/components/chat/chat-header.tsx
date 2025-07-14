import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getFallBack } from "@/lib/utils/getFallback";
import { useChatStore } from "@/store/chat-store";
import userService from "@/services/user-service";
import { UsersResponse } from "@/lib/types/user";
import TimeAgo from "@/lib/utils/format-time";
import SocketClient from "@/socket/socket-client";

function ChatHeader() {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { activeUsers, selectedNewChat, setSelectedChat, setSelectedNewChat } = useChatStore();
  const [isOnline, setIsOnline] = useState<boolean | undefined>(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const socket = SocketClient.init();

  const activeChat = selectedChat || selectedNewChat;

  useEffect(() => {
    if (!activeChat) return;

    const online = activeUsers?.some(
      (user) => user.userId === activeChat.userId
    );
    setIsOnline(online);

    if (!online) {
      (async () => {
        try {
          const response = (await userService.getLastSeen(
            activeChat.userId
          )) as UsersResponse;

          if (response) {
            setLastSeen(new Date(response.data?.lastSeen));
          } else {
            setLastSeen(null);
          }
        } catch (err) {
          console.error("Failed to fetch last seen", err);
        }
      })();
    } else {
      setLastSeen(null);
    }
  }, [activeUsers, activeChat?.userId]);

  useEffect(() => {
    const handleTyping = (response: any) => {
      if (response?.data?.userId === activeChat?.userId) {
        setIsTyping(true);
      }
    };

    const handleNotTyping = (response: any) => {
      if (response?.data?.userId === activeChat?.userId) {
        setIsTyping(false);
      }
    };

    socket.on("user:typing", handleTyping);
    socket.on("user:notTyping", handleNotTyping);

    return () => {
      socket.off("user:typing", handleTyping);
      socket.off("user:notTyping", handleNotTyping);
    };
  }, [activeChat?.userId]);

  const handleBack = () => {
    setSelectedChat(null);
    setSelectedNewChat(null);
  }

  return (
    <>
      <div className="bg-white shadow p-2 flex items-center">
        <button
          onClick={handleBack}
          className="mr-2 p-2 rounded hover:bg-gray-100 focus:outline-none md:hidden"
          aria-label="Back"
          type="button"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M12 15l-5-5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="relative">
          <Avatar className="size-10 border-2">
            <AvatarFallback className="text-gray-700">
              {getFallBack(activeChat?.name ?? "")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="pl-3">
          <h1 className="text-sm">{activeChat?.name}</h1>
          <h2
            className={`text-xs ${
              isOnline ? "text-green-700" : "text-gray-500"
            }  -translate-y-1 pt-1`}
          >
            {isOnline
              ? isTyping
                ? "Typing..."
                : "Online"
              : lastSeen && <TimeAgo timestamp={lastSeen} />}
          </h2>
        </div>
      </div>

      <hr />
    </>
  );
}

export default ChatHeader;