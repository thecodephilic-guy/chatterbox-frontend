import React from "react";

function ChatListItemSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between w-full p-2 animate-pulse">
        <div className="flex items-center">
          <div className="size-16 rounded-full bg-gray-200" />

          <div className="pl-2 space-y-2">
            <div className="w-32 h-4 bg-gray-200 rounded" />
            <div className="w-24 h-3 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="ml-2">
          <div className="size-5 rounded-full bg-gray-200" />
        </div>
      </div>
      <hr />
    </>
  );
}

export default ChatListItemSkeleton;