import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getFallBack } from "@/lib/utils/getFallback";

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  unreadCount: number;
  handleClick: () => void;
}

function ChatListItem(props: ChatListItemProps) {
  const { name, lastMessage, unreadCount, handleClick } = props;


  return (
    <>
      <div
        onClick={handleClick}
        className="flex items-center justify-between w-full p-2 hover:bg-gray-200 hover:cursor-pointer"
      >
        <div className="flex items-center">
          <Avatar className="size-16 border-2">
            {/* <AvatarImage src="https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740" /> */}
            <AvatarFallback className="text-gray-700">
              {getFallBack(name)}
            </AvatarFallback>
          </Avatar>
          <div className="pl-2">
            <h1 className={`text-lg ${unreadCount > 0 ? "font-bold" : ""}`}>
              {name}
            </h1>
            <h2 className="text-sm text-gray-500 -translate-y-1">
              {lastMessage}
            </h2>
          </div>
        </div>
        <div className="ml-2 text-right">
          {unreadCount > 0 && (
            <Avatar className="size-5">
              <AvatarFallback className="text-xs">{unreadCount}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
      <hr />
    </>
  );
}

export default ChatListItem;
