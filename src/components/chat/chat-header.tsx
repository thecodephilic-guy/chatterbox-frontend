import React, { useState } from "react";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getFallBack } from "@/lib/utils/getFallback";
import { useChatStore } from "@/store/chat-store";
import { formatLastSeen } from "@/lib/utils/date-formatter";
import SocketClient from "@/socket/socket-client";

type ActiveUsers = {
  userId: string;
  socketId: string;
}

function ChatHeader() {
  const selectedChat = useChatStore((state) => state.activeUser);

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const socket = SocketClient.getInstance();

    const handleGetUsers = (users: ActiveUsers[]) => {

      
      const online = users.some((user) => user.userId === selectedChat?.id);
      setIsOnline(online);
    };

    socket.on("get-users", handleGetUsers);

    return () => {
      socket.off("get-users", handleGetUsers);
    };
  }, [selectedChat?.id,]);

  return (
    <>
      <div className="bg-white shadow p-2 flex items-center">
        <div className="relative pl-4">
          <Avatar className="size-10 border-2">
            {/* <AvatarImage src="https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740" /> */}
            <AvatarFallback className="text-gray-700">
              {getFallBack(selectedChat?.name ?? "")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="pl-3">
          <h1 className="text-sm">{selectedChat?.name}</h1>
          <h2 className={`text-xs ${isOnline ? 'text-green-700' : 'text-gray-500'}  -translate-y-1 pt-1`}>
            {isOnline ? "Online" : formatLastSeen(selectedChat?.updatedAt ?? "")}
          </h2>
        </div>
      </div>

      <hr />
    </>
  );
}

export default ChatHeader;
