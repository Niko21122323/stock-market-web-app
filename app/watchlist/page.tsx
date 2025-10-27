import { headers } from "next/headers";
import { redirect } from "next/navigation";
import WatchlistTable from "@/components/WatchlistTable";
import { getWatchlist } from "@/lib/actions/watchlist.actions";
import { auth } from "@/lib/better-auth/auth";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import TradingViewWidget from "@/components/TradingViewWidget";
import Header from "@/components/Header";

export default async function WatchlistPage() {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { items, error } = await getWatchlist();

  if (!session?.user) redirect("/sign-in");

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <Header user={user} />

      <div className="container mx-auto py-16 px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            My Watchlist
          </h1>
          <p className="text-muted-foreground">
            Track your favorite stocks and monitor their performance
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {items.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <h2 className="text-2xl font-semibold mb-2 text-gray-300">
              Your watchlist is empty
            </h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              Start adding stocks to your watchlist to keep track of companies
              you're interested in.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </main>
  );
}
