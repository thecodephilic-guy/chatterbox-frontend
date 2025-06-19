import React from "react";
import ChatListItem from "@/components/chat/chat-list-item";
import NewChatListItem from "@/components/chat/new-chat-list-item";
import { useChatStore } from "@/store/chat-store";
import ChatListItemSkeleton from "./skeletons/chat-list-item";
import { Button } from "../ui/button";
import { CircleArrowLeft } from "lucide-react";

function ChatList() {
  const chats = useChatStore((state) => state.filteredChats);
  const allUsers = useChatStore((state) => state.filteredUsers);
  const { setAllUsers } = useChatStore();
  const isLoading = useChatStore((state) => state.loading);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);

  return (
    <>
      <div>
        {allUsers.length === 0 ? (
          chats.map((chat) =>
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
          )
        ) : (
          <div className="p-2">
            <Button
              className="rounded-3xl text-"
              onClick={() => setAllUsers([])}
            >
              <CircleArrowLeft /> Back
            </Button>
            {allUsers.map((user) => (
              <NewChatListItem
                key={user.id}
                name={user.name}
                username={user.username}
                lastSeen={user.lastSeen}
                handleClick={() => console.log("Clicked")}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ChatList;
