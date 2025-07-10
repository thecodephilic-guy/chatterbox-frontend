import { useState, useEffect, useCallback, useRef } from "react";
import { Message, ChatResponse, Chat } from "@/lib/types/chat";
import chatService from "@/services/chat-service";
import { useChatStore } from "@/store/chat-store";
import ensureError from "@/lib/utils/ensureError";
import status from "http-status";

interface UseChatMessagesProps {
  chatId: string | undefined;
  onError: (error: string) => void;
}

interface UseChatMessagesReturn {
  messages: Message[];
  loadingMessages: boolean;
  loadingMoreMessages: boolean;
  hasMoreMessages: boolean;
  shouldScrollToBottom: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  addNewMessage: (message: Message) => void;
  handleScroll: () => void;
  setShouldScrollToBottom: (value: boolean) => void;
}

export const useChatMessages = ({ 
  chatId, 
  onError 
}: UseChatMessagesProps): UseChatMessagesReturn => {
  const { updateUnreadCount } = useChatStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [nextCursor, setNextCursor] = useState<Date | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null!);
  const prevScrollHeight = useRef<number>(0);
  const messageIds = useRef<Set<string>>(new Set());

  // Reset state when chatId changes
  useEffect(() => {
    if (chatId) {
      setMessages([]);
      setLoadingMessages(true);
      setLoadingMoreMessages(false);
      setNextCursor(null);
      setHasMoreMessages(true);
      setShouldScrollToBottom(true);
      messageIds.current.clear();
    }
  }, [chatId]);

  // Mark messages as read
  const markMessagesRead = useCallback(async (selectedChat: Chat) => {
    if (!selectedChat?.chatId || selectedChat?.unreadCount === 0) return;

    try {
      const response = (await chatService.markMessagesRead(
        selectedChat?.chatId
      )) as ChatResponse;

      if (response.status !== status.OK) {
        throw new Error(response.error);
      }
      if (response.status === status.OK) {
        updateUnreadCount();
      }
    } catch (err) {
      onError((err as Error).message);
    }
  }, [updateUnreadCount, onError]);

  // Fetch initial messages
  const fetchInitialMessages = useCallback(async () => {
    if (!chatId) return;

    try {
      setLoadingMessages(true);
      const response = (await chatService.getConversation(chatId)) as ChatResponse;
      
      // Filter out duplicates and sort by createdAt (oldest first)
      const uniqueMessages = response.data.filter((msg: Message) => {
        if (messageIds.current.has(msg.id)) {
          return false;
        }
        messageIds.current.add(msg.id);
        return true;
      }).sort((a: Message, b: Message) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setMessages(uniqueMessages);
      
      // Set cursor to the oldest message for pagination
      if (uniqueMessages.length > 0) {
        setNextCursor(uniqueMessages[0].createdAt);
      }
      
      setHasMoreMessages(response.data.length >= 20); // Assuming 20 is page size
      setShouldScrollToBottom(true);
    } catch (err) {
      onError("Failed to load messages.");
    } finally {
      setLoadingMessages(false);
    }
  }, [chatId, onError]);

  // Fetch more messages (older messages)
  const fetchMoreMessages = useCallback(async () => {
    if (!chatId || !nextCursor || !hasMoreMessages || loadingMoreMessages) return;

    try {
      setLoadingMoreMessages(true);
      prevScrollHeight.current = scrollRef.current?.scrollHeight || 0;
      
      const response = (await chatService.getConversation(
        chatId,
        nextCursor
      )) as ChatResponse;

      if (response.data.length > 0) {
        // Filter out duplicates and sort by createdAt (oldest first)
        const uniqueMessages = response.data.filter((msg: Message) => {
          if (messageIds.current.has(msg.id)) {
            return false;
          }
          messageIds.current.add(msg.id);
          return true;
        }).sort((a: Message, b: Message) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        if (uniqueMessages.length > 0) {
          // Add older messages to the beginning
          setMessages(prev => [...uniqueMessages, ...prev]);
          setNextCursor(uniqueMessages[0].createdAt);
        }
        
        setHasMoreMessages(response.data.length >= 20);
      } else {
        setHasMoreMessages(false);
      }
    } catch (err) {
      onError("Failed to load more messages.");
    } finally {
      setLoadingMoreMessages(false);
    }
  }, [chatId, nextCursor, hasMoreMessages, loadingMoreMessages, onError]);

  // Handle scroll for pagination
  const handleScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Check if user scrolled to top (load older messages)
    if (scrollContainer.scrollTop <= 100 && hasMoreMessages && !loadingMoreMessages) {
      fetchMoreMessages();
    }
  }, [hasMoreMessages, loadingMoreMessages, fetchMoreMessages]);

  // Add new message (for real-time updates)
  const addNewMessage = useCallback((message: Message) => {
    // Check for duplicates
    if (messageIds.current.has(message.id)) {
      return;
    }
    
    messageIds.current.add(message.id);
    setMessages(prev => [...prev, message]);
    setShouldScrollToBottom(true);
  }, []);

  // Handle scroll positioning
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Auto-scroll to bottom for new messages
    if (shouldScrollToBottom) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      setShouldScrollToBottom(false);
    }

    // Maintain scroll position after loading more messages
    if (loadingMoreMessages && prevScrollHeight.current > 0) {
      const newScrollHeight = scrollContainer.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeight.current;
      scrollContainer.scrollTop = scrollDiff;
      prevScrollHeight.current = 0;
    }
  }, [messages, shouldScrollToBottom, loadingMoreMessages]);

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Initial fetch when chatId changes
  useEffect(() => {
    if (chatId) {
      fetchInitialMessages();
    }
  }, [chatId, fetchInitialMessages]);

  return {
    messages,
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages,
    shouldScrollToBottom,
    scrollRef,
    addNewMessage,
    handleScroll,
    setShouldScrollToBottom,
  };
};