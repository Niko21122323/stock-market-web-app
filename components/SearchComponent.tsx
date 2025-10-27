"use client";

import { Loader2, SearchIcon, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hoks/useDebounce";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import WatchlistButton from "@/components/WatchlistButton"; // Import your button

export default function SearchCommand({
  renderAs = "button",
  label = "Add stock",
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);

    setLoading(true);

    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  };

  // Handle watchlist changes to update local state
  const handleWatchlistChange = (symbol: string, added: boolean) => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.symbol === symbol ? { ...stock, isInWatchlist: added } : stock,
      ),
    );
  };

  return (
    <>
      {renderAs === "text" ? (
        <span
          onClick={() => setOpen(true)}
          className="flex items-center text-foreground text-md font-semibold group-hover:text-background transition-colors duration-300 ease-in-out w-full h-full"
        >
          <SearchIcon className="h-4 w-4 mr-4 group-hover:text-background transition-colors duration-300 ease-in-out" />
          {label}
        </span>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="text-foreground text-md font-semibold group-hover:text-background transition-colors duration-300 ease-in-out w-full h-full"
        >
          <SearchIcon className="h-4 w-4 mr-4 group-hover:text-background transition-colors duration-300 ease-in-out" />
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="border border-border p-4"
      >
        <div className="!bg-background border-b border-border">
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search stocks..."
            className="!bg-background placeholder:text-foreground focus:ring-0"
          />
          {loading && (
            <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground animate-spin" />
          )}
        </div>
        <div className="h-4 bg-background"></div>
        <CommandList className="bg-background">
          {loading ? (
            <CommandEmpty className="search-list-empty">
              Loading stocks...
            </CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="px-5 py-2">
              {isSearchMode ? "No results found" : "No stocks available"}
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              <div className="search-count px-2 py-4 border-b border-border mr-4">
                {isSearchMode ? "Search results" : "Popular stocks"}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock) => (
                <li
                  key={stock.symbol}
                  className="search-item p-2 mr-4 hover:bg-primary transition-colors duration-300 ease-in-out rounded-lg group"
                >
                  <div className="cursor-pointer flex items-center justify-between w-full">
                    <Link
                      href={`/stocks/${stock.symbol}`}
                      onClick={handleSelectStock}
                      className="flex items-center flex-1 hover:text-white"
                    >
                      <TrendingUp className="h-4 w-4 text-foreground/80 group-hover:text-background transition-colors duration-300 ease-in-out mr-3" />
                      <div className="flex-1">
                        <div className="text-foreground font-medium text-lg group-hover:text-background transition-colors duration-300 ease-in-out">
                          {stock.name}
                        </div>
                        <div className="text-sm text-foreground/70 pt-1 group-hover:text-background transition-colors duration-300 ease-in-out">
                          {stock.symbol} | {stock.exchange} | {stock.type}
                        </div>
                      </div>
                    </Link>

                    <div
                      className="w-10 h-10 flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <WatchlistButton
                        symbol={stock.symbol}
                        company={stock.name}
                        isInWatchlist={stock.isInWatchlist}
                        type="icon"
                        onWatchlistChange={handleWatchlistChange}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
