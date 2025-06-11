import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile, SendHorizonal } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (message.trim() === "") return;
    onSendMessage(message.trim());
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center w-full gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </PopoverContent>
      </Popover>

      <div className="flex-1">
        <Input
          ref={inputRef}
          className="rounded-lg px-4 py-2 text-sm w-full placeholder:text-gray-400 border-gray-300 bg-gray-100 focus-visible:ring-0"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
        <SendHorizonal className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChatInput;
