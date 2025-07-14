import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useDebounce } from "@/hooks/useDebounce";

function SearchBar() {
  const [localTerm, setLocalTerm] = useState("");
  const {isNewChatMode, setSearchTerm, clearSearch, searchNewUsers} = useChatStore();

  const debouncedSearchUsers = useDebounce((term: string) => {
    if (term.trim() !== "") {
      searchNewUsers(term);
    }
  }, 500);

  useEffect(() => {
    if (localTerm.trim() === "") {
      clearSearch();
    } else if (!isNewChatMode) {
      setSearchTerm(localTerm);
    } else {
      debouncedSearchUsers(localTerm);
    }
  }, [localTerm]);

  return (
    <>
      <div className="bg-white shadow p-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            className="border-gray-300 bg-gray-100 rounded-sm pl-10 placeholder:text-gray-400 focus-visible:ring-0 font-medium"
            placeholder="Search"
            value={localTerm}
            onChange={(e) => setLocalTerm(e.target.value)}
          />
        </div>
      </div>
      <hr />
    </>
  );
}

export default SearchBar;