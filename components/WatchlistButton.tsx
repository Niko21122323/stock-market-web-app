"use client";

import { useMemo, useState, useTransition } from "react";
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
        className={`relative overflow-hidden w-full flex items-center justify-center cursor-pointer text-background rounded-lg border border-primary py-3 px-6 group ${isPending ? "opacity-50 cursor-wait" : ""}`}
        onClick={handleClick}
        disabled={isPending}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={added ? "white" : "none"}
          stroke="white"
          strokeWidth="1.5"
          className="watchlist-star"
        >
          <title>Trash icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
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
