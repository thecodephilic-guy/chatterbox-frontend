import React, { useState } from "react";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getFallBack } from "@/lib/utils/getFallback";
import { useChatStore } from "@/store/chat-store";
import { formatLastSeen } from "@/lib/utils/date-formatter";
import userService from "@/services/user-service";

function ChatHeader() {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { activeUsers } = useChatStore();
  const { clearSelectedChat } = useChatStore();

  const [isOnline, setIsOnline] = useState<boolean | undefined>(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    if (!selectedChat?.userId) return;

    const online = activeUsers?.some(
      (user) => user.userId === selectedChat?.userId
    );
    setIsOnline(online);

    //if not online then fetch lastSeen:
    if (!online) {
      (async () => {
        try {
          const response = (await userService.getLastSeen(
            selectedChat.userId
          )) as { lastSeen: Date | null };
          console.log(response);
          
          if (response?.lastSeen !== null) {
            setLastSeen(new Date(response.lastSeen));
          }else{
            setLastSeen(null);
          }
        } catch (err) {
          console.error("Failed to fetch last seen", err);
        }
      })();
    } else {
      setLastSeen(null); // Clear lastSeen if user is online
    }
  }, [activeUsers, selectedChat?.userId]);

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
            {isOnline ? "Online" : lastSeen && formatLastSeen(lastSeen)}
          </h2>
        </div>
      </div>

      <hr />
    </>
  );
}

export default ChatHeader;
