import { create } from "zustand";
import { Chat } from "@/lib/types/chat";

type ChatStore = {
  chats: Chat[];
  filteredChats: Chat[];
  searchTerm: string;
};

type ChatActions = {
  setChats: (chats: Chat[]) => void;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
};

export const useChatStore = create<ChatStore & ChatActions>((set, get) => ({
  //initials:
  chats: [],
  filteredChats: [],
  searchTerm: "",

  //actions:
  setChats: (chats) =>
    set({
      chats,
      filteredChats: chats, //initially all
    }),

  setSearchTerm: (term) => {
    const { chats } = get(); //to get all the chats from store
    const filtered = chats.filter((chat) =>
      chat.name.toLowerCase().includes(term.toLowerCase())
    );
    
    set({ searchTerm: term, filteredChats: filtered });
  },

  clearSearch: () => {
    const { chats } = get();
    set({ searchTerm: "", filteredChats: chats });
  },
}));
