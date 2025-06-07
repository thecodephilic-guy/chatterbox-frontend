import React, { useState } from "react";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getFallBack } from "@/lib/utils/getFallback";
import { useChatStore } from "@/store/chat-store";
import { formatLastSeen } from "@/lib/utils/date-formatter";

function ChatHeader() {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { activeUsers } = useChatStore();
  const {clearSelectedChat} = useChatStore();

  const [isOnline, setIsOnline] = useState<boolean | undefined>(false);

  useEffect(() => {
    const online = activeUsers?.some(
      (user) => user.userId === selectedChat?.id
    );
    setIsOnline(online);
  }, [activeUsers, selectedChat]);

  const handleBack = () => {
    // window.history.back();
    clearSelectedChat();
  };

  return (
    <>
      <div className="bg-white shadow p-2 flex items-center">
        {/* Back button: visible only on mobile screens */}
        <button
          onClick={handleBack}
          className="mr-2 p-2 rounded hover:bg-gray-100 focus:outline-none md:hidden"
          aria-label="Back"
          type="button"
        >
          {/* Simple left arrow SVG */}
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
            {/* <AvatarImage src="..." /> */}
            <AvatarFallback className="text-gray-700">
              {getFallBack(selectedChat?.name ?? "")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="pl-3">
          <h1 className="text-sm">{selectedChat?.name}</h1>
          <h2
            className={`text-xs ${
              isOnline ? "text-green-700" : "text-gray-500"
            }  -translate-y-1 pt-1`}
          >
            {isOnline
              ? "Online"
              : formatLastSeen(selectedChat?.updatedAt ?? "")}
          </h2>
        </div>
      </div>

      <hr />
    </>
  );
}

export default ChatHeader;
