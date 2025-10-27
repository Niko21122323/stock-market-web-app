"use client";

import { useEffect, useState } from "react";
import WatchlistTable from "@/components/WatchlistTable";
import TradingViewWidget from "@/components/TradingViewWidget";
import { getWatchlist } from "@/lib/actions/watchlist.actions";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

type WatchlistItem = {
  symbol: string;
  company: string;
  addedAt: string;
  price?: number | null;
  marketCap?: number | null;
  peRatio?: number | null;
  eps?: number | null;
  divYield?: number | null;
};

export default function WatchlistClientWrapper({
  initialItems,
  initialError,
}: {
  initialItems: WatchlistItem[];
  initialError?: string;
}) {
  const [items, setItems] = useState<WatchlistItem[]>(initialItems);
  const [error, setError] = useState<string>(initialError || "");
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  const fetchWatchlist = async () => {
    try {
      const result = await getWatchlist();
      if (result.error) {
        setError(result.error);
      } else {
        setItems(result.items);
        setError("");
      }
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
    }
  };

  // Listen for watchlist changes
  useEffect(() => {
    const handleUpdate = () => {
      fetchWatchlist();
    };

    window.addEventListener("watchlist-updated", handleUpdate);

    return () => {
      window.removeEventListener("watchlist-updated", handleUpdate);
    };
  }, []);

  if (items.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <h2 className="text-2xl font-semibold mb-2 text-gray-300">
          Your watchlist is empty
        </h2>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Start adding stocks to your watchlist to keep track of companies
          you're interested in.
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <WatchlistTable items={items} />
      <div className={`grid pt-10 gap-6`}>
        {items.map((item) => (
          <div
            className="grid grid-cols-1 md:grid-cols-2 md:gap-6 max-md:border-t border-border max-md:pt-6"
            key={item.symbol}
          >
            <TradingViewWidget
              key={item.symbol}
              scriptUrl={`${scriptUrl}symbol-info.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(item.symbol)}
            />
            <TradingViewWidget
              scriptUrl={`${scriptUrl}financials.js`}
              config={COMPANY_FINANCIALS_WIDGET_CONFIG(item.symbol)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
