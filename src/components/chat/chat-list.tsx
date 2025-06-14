import React from "react";
import ChatListItem from "@/components/chat/chat-list-item";
import { useChatStore } from "@/store/chat-store";
import ChatListItemSkeleton from "./skeletons/chat-list-item";

function ChatList() {
  const chats = useChatStore((state) => state.filteredChats);
  const isLoading = useChatStore((state) => state.loading);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
    
  return (
    <>
      <div>
        {chats.map((chat) =>
          isLoading ? (
            <ChatListItemSkeleton key={chat.chatId} />
          ) : (
            <ChatListItem
              key={chat.chatId}
              name={chat.name}
              lastMessage={chat.lastMessage}
              unreadCount={chat.unreadCount}
              handleClick={() => setSelectedChat(chat)}
            />
          )
        )}
      </div>
    </>
  );
}

export default ChatList;
