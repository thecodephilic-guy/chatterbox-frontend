import { create } from "zustand";
import { Chat } from "@/lib/types/chat";
import { ActiveUsers, User } from "@/lib/types/user";

type ChatStore = {
  chats: Chat[];
  filteredChats: Chat[];
  chatError: string;
  searchTerm: string;
  loading: boolean;
  selectedChat: Chat | null;
  selectedNewChat: User | null;
  activeUsers: ActiveUsers[] | [];
  typingUsers: string[] | null;
  newChatUsers: User[];
  filteredNewChatUsers: User[];
};

type ChatActions = {
  setChats: (chats: Chat[]) => void;
  setChatError: (message: string) => void;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  setLoading: (isLoading: boolean) => void;
  setSelectedChat: (chat: Chat) => void;
  setSelectedNewChat: (user: User | null) => void;
  setActiveUsers: (activeUsersData: ActiveUsers[]) => void;
  clearSelectedChat: () => void;
  setTypingUsers: (userId: string, isTyping: boolean) => void;
  setNewChatUsers: (users: User[]) => void;
  updateUnreadCount: () => void;
  updateLastMessage: (message: string) => void;
};

export const useChatStore = create<ChatStore & ChatActions>((set, get) => ({
  //initials:
  chats: [],
  filteredChats: [],
  chatError: "",
  searchTerm: "",
  loading: false,
  selectedChat: null,
  selectedNewChat: null,
  activeUsers: [],
  typingUsers: null,
  newChatUsers: [],
  filteredNewChatUsers: [],

  //actions:
  setChats: (chats) =>
    set({
      chats,
      filteredChats: chats, //initially all
    }),

  setChatError: (message) => set({ chatError: message }),

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
  setLoading: (isLoading) =>
    set({
      loading: isLoading,
    }),

  setSelectedChat: (chat: Chat) =>
    set({
      selectedChat: chat,
    }),

  setSelectedNewChat: (user: User | null) => set({ selectedNewChat: user }),

  setActiveUsers: (activeUsers) => set({ activeUsers }),
  clearSelectedChat: () => set({ selectedChat: null }),

  setNewChatUsers: (users) =>
    set({ newChatUsers: users, filteredNewChatUsers: users }),

  setTypingUsers: (userId, isTyping) => {
    set((state) => {
      const typingUsers = state.typingUsers ?? [];
      const isAlreadyTyping = typingUsers.includes(userId);
      if (isTyping && !isAlreadyTyping) {
        return { typingUsers: [...typingUsers, userId] };
      } else if (!isTyping && isAlreadyTyping) {
        return { typingUsers: typingUsers.filter((id) => id !== userId) };
      }
      return state;
    });
  },

  updateUnreadCount: () => {
    const { selectedChat, chats } = get();

    if (!selectedChat) return;

    //update the selected chat object:
    const updatedSelectedChat = { ...selectedChat, unreadCount: 0 };

    //updating the chat list:
    const updatedChats = chats.map((chat) =>
      chat.chatId === selectedChat.chatId ? { ...chat, unreadCount: 0 } : chat
    );

    set({
      selectedChat: updatedSelectedChat,
      chats: updatedChats,
      filteredChats: updatedChats,
    });
  },

  updateLastMessage: (message: string) => {
    const { selectedChat, chats } = get();

    if (!selectedChat) return;

    const updatedChats = chats.map((chat) =>
      chat.chatId === selectedChat.chatId
        ? { ...chat, lastMessage: message }
        : chat
    );

    set({
      chats: updatedChats,
      filteredChats: updatedChats,
    });
  },
}));
