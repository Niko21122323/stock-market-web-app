import { headers } from "next/headers";
import { redirect } from "next/navigation";
import WatchlistClientWrapper from "@/components/WatchlistClientWrapper";
import { getWatchlist } from "@/lib/actions/watchlist.actions";
import { auth } from "@/lib/better-auth/auth";
import Header from "@/components/Header";

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { items, error } = await getWatchlist();

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

        <WatchlistClientWrapper initialItems={items} initialError={error} />
      </div>
    </main>
  );
}
