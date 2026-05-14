import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const Search = () => {
    return (
        <div className="flex items-center gap-2 w-full bg-primary shadow-md px-4 pb-2">
            {/* Full width Search Input */}
            <Input
                type="text"
                placeholder="Search..."
                className="flex-1 border-none bg-white text-gray-900 rounded-full"
            />

            {/* Filter Button */}
            <Button
                variant="outline"
                size="icon"
                className="bg-blue-800 text-white hover:bg-blue-900 hover:text-white border-none"
            >
                <Filter className="h-5 w-5" />
            </Button>
        </div>
    );
};

export default Search;
