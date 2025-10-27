import { headers } from "next/headers";
import { redirect } from "next/navigation";
import WatchlistTable from "@/components/WatchlistTable";
import { getWatchlist } from "@/lib/actions/watchlist.actions";
import { auth } from "@/lib/better-auth/auth";

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { items, error } = await getWatchlist();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
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
          <WatchlistTable items={items} />
        )}
      </div>
    </div>
  );
}
