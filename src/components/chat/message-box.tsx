import React from "react";
import clsx from "clsx";
import TimeAgo from "@/lib/utils/format-time";

type MessageBoxProps = {
  content: string;
  isOwnMessage?: boolean;
  timestamp?: Date;
};

const MessageBox: React.FC<MessageBoxProps> = ({
  content,
  isOwnMessage = false,
  timestamp,
}) => {
  return (
    <div
      className={clsx(
        "flex w-full mb-2",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl text-sm shadow",
          isOwnMessage
            ? "bg-gray-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white rounded-bl-none"
        )}
      >
        <p className="whitespace-pre-line break-words">{content}</p>

        {timestamp && (
          <p className="text-[10px] text-gray-400 mt-1 text-right">
            <TimeAgo timestamp={timestamp} />
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
