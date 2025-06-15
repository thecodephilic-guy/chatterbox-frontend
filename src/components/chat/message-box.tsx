import React from "react";
import clsx from "clsx";

type MessageBoxProps = {
  message: string;
  isOwnMessage?: boolean;
  senderName?: string;
  timestamp?: string;
};

const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  isOwnMessage = false,
  senderName,
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
        {senderName && !isOwnMessage && (
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
            {senderName}
          </p>
        )}

        <p className="whitespace-pre-line break-words">{message}</p>

        {timestamp && (
          <p className="text-[10px] text-gray-400 mt-1 text-right">{timestamp}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBox;