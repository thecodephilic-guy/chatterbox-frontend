import React from "react";
import SearchBar from "@/components/dashboard/search-bar";
import ChatList from "@/components/chat/chat-list";
import { Button } from "../ui/button";
import { MessageSquarePlus } from "lucide-react";
import { UsersResponse } from "@/lib/types/user";
import userService from "@/services/user-service";
import { useChatStore } from "@/store/chat-store";

function Sidebar() {
  const { setNewChatUsers, setIsNewChatMode } = useChatStore();

  const handleOnClick = async () => {
    setIsNewChatMode(true);
    try {
      const response = (await userService.fetchNewUsers()) as UsersResponse;
      setNewChatUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative h-full">
      <SearchBar />
      <ChatList />
      <div className="absolute bottom-12 right-12">
        <Button
          onClick={handleOnClick}
          className="flex items-center gap-2 px-4 rounded-full w-12 h-12 py-2"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;