import React from "react";
import ChatListItem from "@/components/chat/chat-list-item";
import NewChatListItem from "@/components/chat/new-chat-list-item";
import { useChatStore } from "@/store/chat-store";
import ChatListItemSkeleton from "./skeletons/chat-list-item";
import { Button } from "../ui/button";
import { CircleArrowLeft } from "lucide-react";
import { Chat } from "@/lib/types/chat";
import { User } from "@/lib/types/user";
import chatService from "@/services/chat-service";
import status from "http-status";

function ChatList() {
  const newUsers = useChatStore((state) => state.filteredNewChatUsers) || [];
  const chats = useChatStore((state) => state.filteredChats) || [];
  const { setNewChatUsers, setSelectedNewChat, clearSelectedChat } =
    useChatStore();
  const isLoading = useChatStore((state) => state.loading);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);

  const handleSelectChat = React.useCallback(
    (chat: Chat) => {
      setSelectedChat(chat);
    },
    [setSelectedChat]
  );

  const handleSelectNewChat = React.useCallback(
    async (user: User) => {
      const chatResponse = await chatService.findChatId(user.userId);
      if (chatResponse.status === status.OK && chatResponse.data.existingChat) {
        const chatId = chatResponse.data.chatId;
        const chatToBeSelected = chats.find((chat) => chat.chatId === chatId);
        if (!chatToBeSelected) return;
        setSelectedChat(chatToBeSelected);
        setNewChatUsers([]);
        return;
      }

      clearSelectedChat();
      setSelectedNewChat(user);
    },
    [setSelectedNewChat, clearSelectedChat, setSelectedChat, chats]
  );

  return (
    <>
      <div>
        {newUsers.length === 0 ? (
          chats.map((chat) =>
            isLoading ? (
              <ChatListItemSkeleton key={chat.chatId} />
            ) : (
              <ChatListItem
                key={chat.chatId}
                name={chat.name}
                lastMessage={chat.lastMessage}
                unreadCount={chat.unreadCount}
                handleClick={() => handleSelectChat(chat)}
              />
            )
          )
        ) : (
          <div className="p-2">
            <Button className="rounded-3xl" onClick={() => setNewChatUsers([])}>
              <CircleArrowLeft /> Back
            </Button>
            {newUsers.map((user) => (
              <NewChatListItem
                key={user.userId}
                name={user.name}
                username={user.username}
                lastSeen={user.lastSeen}
                handleClick={() => handleSelectNewChat(user)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ChatList;
