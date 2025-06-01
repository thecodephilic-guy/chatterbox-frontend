'use client'

import React from "react";
import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";

function Chats() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <>
      <div className="h-full grid grid-cols-1 md:grid-cols-3">
      {/* Chat list sidebar */}
      <div className={`overflow-y-auto border-r ${selectedChatId ? 'hidden md:block' : 'block'}`}>
        <Sidebar />
      </div>

      {/* Chat area */}
      <div className={`${selectedChatId ? 'block' : 'hidden md:block'} md:col-span-2`}>
        
      </div>
    </div>
    </>
  );
}

export default Chats;
