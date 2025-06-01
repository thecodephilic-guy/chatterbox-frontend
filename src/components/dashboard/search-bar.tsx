import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function SearchBar() {
    return (
        <>
        <div className="relative w-full px-2 py-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                className="border-gray-300 bg-gray-100 rounded-sm pl-8 placeholder:text-gray-400 focus-visible:ring-0 font-medium"
                placeholder="Search"
            />
        </div>
        <hr />
        </>
        
    );
}

export default SearchBar;
