import React from "react";
import ChatListItem from "@/components/chat/chat-list-item";
import NewChatListItem from "@/components/chat/new-chat-list-item";
import { useChatStore } from "@/store/chat-store";
import ChatListItemSkeleton from "./skeletons/chat-list-item";
import { Button } from "../ui/button";
import { CircleArrowLeft } from "lucide-react";
import { Chat } from "@/lib/types/chat";
import chatService from "@/services/chat-service";

function ChatList() {
  const chats = useChatStore((state) => state.filteredChats);
  const newUsers = useChatStore((state) => state.filteredNewChatUsers);
  const { setNewChatUsers } = useChatStore();
  const isLoading = useChatStore((state) => state.loading);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);

  const handleChatClick = async (chat: Chat) => {
    //this function will be executed when user clicks on a particular chat
    //what it should do?
    //1. It should set the value for selected chat.
    //2. Take the chatId and make api call for marking messages as read, becuause opening chat will make messages seen.
    setSelectedChat(chat);
    // try {
    //   await chatService.markMessagesSeen(chat.chatId);
    // } catch (err) {
    //   console.error("error in updating seen status:" + err);
    // }
  };

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
                handleClick={() => handleChatClick(chat)}
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
