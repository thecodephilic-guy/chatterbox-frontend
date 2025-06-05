import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useChatStore } from "@/store/chat-store";

function SearchBar() {
  const setSearchTerm = useChatStore((state) => state.setSearchTerm);
  const searchTerm = useChatStore((state) => state.searchTerm);
  const clearSearch = useChatStore((state) => state.clearSearch);

  useEffect(() => {
    if (searchTerm.length === 0) {
      clearSearch();
    }
  }, [searchTerm.length]);

  return (
    <>
      <div className="bg-white shadow p-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            className="border-gray-300 bg-gray-100 rounded-sm pl-10 placeholder:text-gray-400 focus-visible:ring-0 font-medium"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <hr />
    </>
  );
}

export default SearchBar;
