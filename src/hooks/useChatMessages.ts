import { useState, useEffect, useCallback, useRef } from "react";
import { Message, ChatResponse } from "@/lib/types/chat";
import chatService from "@/services/chat-service";
import { useChatStore } from "@/store/chat-store";
import status from "http-status";

interface UseChatMessagesProps {
  chatId?: string;
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
  clearMessages: () => void;
}

export const useChatMessages = ({
  chatId,
  onError,
}: UseChatMessagesProps): UseChatMessagesReturn => {
  const { updateUnreadCount } = useChatStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [nextCursor, setNextCursor] = useState<Date | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null!);
  const prevScrollHeight = useRef<number>(0);
  const messageIds = useRef<Set<string>>(new Set());

  const clearMessages = useCallback(() => {
    setMessages([]);
    setLoadingMessages(false);
    setLoadingMoreMessages(false);
    setNextCursor(null);
    setHasMoreMessages(true);
    setShouldScrollToBottom(true);
    messageIds.current.clear();
  }, []);

  // Reset messages whenever chatId changes
  useEffect(() => {
    clearMessages();

    if (!chatId) return;

    const fetchInitialMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = (await chatService.getConversation(
          chatId
        )) as ChatResponse;

        const uniqueMessages = response.data
          .filter((msg: Message) => {
            if (messageIds.current.has(msg.id)) return false;
            messageIds.current.add(msg.id);
            return true;
          })
          .sort(
            (a: any, b: any) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        setMessages(uniqueMessages);

        if (uniqueMessages.length > 0) {
          setNextCursor(uniqueMessages[0].createdAt);
        }

        setHasMoreMessages(response.data.length >= 20);
        setShouldScrollToBottom(true);
      } catch {
        onError("Failed to load messages.");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchInitialMessages();
  }, [chatId, clearMessages, onError]);

  const fetchMoreMessages = useCallback(async () => {
    if (!chatId || !nextCursor || !hasMoreMessages || loadingMoreMessages)
      return;

    try {
      setLoadingMoreMessages(true);
      prevScrollHeight.current = scrollRef.current?.scrollHeight || 0;

      const response = (await chatService.getConversation(
        chatId,
        nextCursor
      )) as ChatResponse;

      const uniqueMessages = response.data
        .filter((msg: Message) => {
          if (messageIds.current.has(msg.id)) return false;
          messageIds.current.add(msg.id);
          return true;
        })
        .sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      if (uniqueMessages.length > 0) {
        setMessages((prev) => [...uniqueMessages, ...prev]);
        setNextCursor(uniqueMessages[0].createdAt);
      }

      setHasMoreMessages(response.data.length >= 20);
    } catch {
      onError("Failed to load more messages.");
    } finally {
      setLoadingMoreMessages(false);
    }
  }, [chatId, nextCursor, hasMoreMessages, loadingMoreMessages, onError]);

  const handleScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    if (
      scrollContainer.scrollTop <= 100 &&
      hasMoreMessages &&
      !loadingMoreMessages
    ) {
      fetchMoreMessages();
    }
  }, [hasMoreMessages, loadingMoreMessages, fetchMoreMessages]);

  const addNewMessage = useCallback((message: Message) => {
    if (messageIds.current.has(message.id)) return;

    messageIds.current.add(message.id);
    setMessages((prev) => [...prev, message]);
    setShouldScrollToBottom(true);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    if (shouldScrollToBottom) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      setShouldScrollToBottom(false);
    }

    if (loadingMoreMessages && prevScrollHeight.current > 0) {
      const newScrollHeight = scrollContainer.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeight.current;
      scrollContainer.scrollTop = scrollDiff;
      prevScrollHeight.current = 0;
    }
  }, [messages, shouldScrollToBottom, loadingMoreMessages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
    clearMessages,
  };
};
