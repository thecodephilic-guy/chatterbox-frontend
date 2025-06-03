import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function SearchBar() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow p-2">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            className="border-gray-300 bg-gray-100 rounded-sm pl-8 placeholder:text-gray-400 focus-visible:ring-0 font-medium"
            placeholder="Search"
          />
        </div>
      </div>
      <div style={{ height: "56px" }} /> {/* Spacer to prevent content from being hidden */}
      <hr />
    </>
  );
}

export default SearchBar;
