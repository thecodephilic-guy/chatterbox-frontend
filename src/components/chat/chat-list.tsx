import React from "react";
import ChatListItem from "@/components/chat/chat-list-item";
import { Chat } from "@/lib/types/chat";
import { useChatStore } from "@/store/chat-store";

function ChatList() {
  const chats = useChatStore((state) => state.filteredChats);

  return (
    <>
      <div>
        {chats.map((chat) => (
          <ChatListItem
            key={chat.chatId}
            name={chat.name}
            lastMessage={chat.lastMessage}
            unreadCount={chat.unreadCount}
          />
        ))}
      </div>
    </>
  );
}

export default ChatList;
