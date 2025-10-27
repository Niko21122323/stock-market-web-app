"use client";

import { Star } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist?: boolean;
  showTrashIcon?: boolean;
  type?: "button" | "icon";
  onWatchlistChange?: (symbol: string, added: boolean) => void;
}

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist = false,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(isInWatchlist);
  const [isPending, startTransition] = useTransition();

  // Sync local state with prop changes
  useEffect(() => {
    setAdded(isInWatchlist);
  }, [isInWatchlist]);

  const label = useMemo(() => {
    if (type === "icon") return "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const handleClick = () => {
    const nextState = !added;

    startTransition(async () => {
      try {
        if (nextState) {
          const result = await addToWatchlist(symbol, company);
          if (result.success) {
            setAdded(true);
            onWatchlistChange?.(symbol, true);
          }
        } else {
          const result = await removeFromWatchlist(symbol);
          if (result.success) {
            setAdded(false);
            onWatchlistChange?.(symbol, false);
          }
        }
      } catch (err) {
        console.error("Watchlist action failed:", err);
      }
    });
  };

  if (type === "icon") {
    return (
      <button
        type="button"
        title={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        aria-label={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        className={`group cursor-pointer ${isPending ? "opacity-50 cursor-wait" : ""}`}
        onClick={handleClick}
        disabled={isPending}
      >
        <Star
          className={`h-5 w-5 transition-colors duration-200 ${
            added
              ? "fill-yellow-400 text-yellow-400"
              : "fill-none text-foreground/60 group-hover:text-foreground"
          }`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`relative overflow-hidden w-full flex items-center justify-center cursor-pointer text-background rounded-lg border border-primary py-3 px-6 group ${isPending ? "opacity-50 cursor-wait" : ""}`}
      onClick={handleClick}
      disabled={isPending}
    >
      <div className="absolute bottom-0 left-0 w-full h-full bg-primary group-hover:h-0 transition-all duration-300 ease-in-out"></div>
      {showTrashIcon && added ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <title>Trash icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6"
          />
        </svg>
      ) : null}
      <span className="relative z-10 group-hover:text-foreground transition-colors duration-300 ease-in-out">
        {isPending ? "..." : label}
      </span>
    </button>
  );
};

export default WatchlistButton;
