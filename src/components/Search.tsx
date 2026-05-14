"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
    return (
        <div className="flex items-center justify-center gap-2 w-full bg-primary px-4 py-2">
            <div className="flex items-center w-full max-w-xl bg-white rounded-full overflow-hidden shadow-sm">
                <SearchIcon className="h-4 w-4 text-gray-400 ml-3 shrink-0" />
                <Input
                    type="text"
                    placeholder="Search..."
                    className="border-none shadow-none bg-transparent text-gray-900 focus-visible:ring-0 rounded-none"
                />
            </div>
            <Button
                variant="outline"
                size="icon"
                className="bg-blue-800 text-white hover:bg-blue-900 hover:text-white border-none rounded-full shrink-0"
            >
                <SearchIcon className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default Search;
