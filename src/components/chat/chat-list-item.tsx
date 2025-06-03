import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function ChatListItem() {
  const getFallBack = (fullName: string): string => {
    const words = fullName.trim().split(" ");
    const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
    return initials;
  };

const seedData = {
    name: "Your Name",
    fallBack: getFallBack("Your Name"),
    lastMessage: "Your last message here",
    unreadCount: 2
};

  return (
    <div className="flex items-center justify-between w-full p-2 hover:bg-gray-50 hover:cursor-pointer">
      <div className="flex items-center">
        <Avatar className="size-16 border-1">
            <AvatarImage src="https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740" />
          <AvatarFallback className="text-gray-700">{seedData.fallBack}</AvatarFallback>
        </Avatar>
        <div className="pl-2">
          <h1 className="text-lg">{seedData.name}</h1>
          <h2 className="text-sm text-gray-500 -translate-y-1">
            {seedData.lastMessage}
          </h2>
        </div>
      </div>
      <div className="ml-2 text-right">
        <Avatar className="size-5">
          <AvatarFallback className="text-xs">{seedData.unreadCount}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default ChatListItem;
