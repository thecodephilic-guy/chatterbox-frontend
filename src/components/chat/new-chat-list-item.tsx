import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getFallBack } from "@/lib/utils/getFallback";
import { formatDistanceToNowStrict } from "date-fns";
import TimeAgo from "@/lib/utils/format-time";

interface NewChatListItemProps {
  name: string;
  username: string;
  lastSeen: Date | null;
  handleClick: () => void;
}

function NewChatListItem({ name, username, lastSeen, handleClick }: NewChatListItemProps) {
  const lastSeenText = lastSeen
    ? <TimeAgo timestamp={lastSeen} />
    : "Offline";

  return (
    <>
      <div
        onClick={handleClick}
        className="flex items-center justify-between w-full p-3 hover:bg-gray-100 hover:cursor-pointer"
      >
        <div className="flex items-center">
          <Avatar className="size-14 border-2">
            {/* <AvatarImage src="https://your-avatar-source.com" /> */}
            <AvatarFallback className="text-gray-700">
              {getFallBack(name)}
            </AvatarFallback>
          </Avatar>

          <div className="pl-3">
            <h1 className="text-lg font-medium">{name}</h1>
            <h2 className="text-sm text-gray-500">@{username}</h2>
          </div>
        </div>

        <div className="text-sm text-right text-gray-400 whitespace-nowrap">
          {lastSeenText}
        </div>
      </div>
      <hr />
    </>
  );
}

export default NewChatListItem;