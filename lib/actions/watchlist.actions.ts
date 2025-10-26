"use server";

import { headers } from "next/headers";
import { Watchlist } from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";
import { auth } from "@/lib/better-auth/auth";
import { getStockMetrics } from "./finnhub.actions";

// Get current user from session
async function getCurrentUserId(): Promise<string | null> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user?.id) return null;
		return session.user.id;
	} catch (err) {
		console.error("getCurrentUserId error:", err);
		return null;
	}
}

export async function addToWatchlist(symbol: string, company: string) {
	try {
		const userId = await getCurrentUserId();
		if (!userId) {
			return { success: false, error: "Not authenticated" };
		}

		await connectToDatabase();

		const existing = await Watchlist.findOne({
			userId,
			symbol: symbol.toUpperCase(),
		});
		if (existing) {
			return { success: true, message: "Already in watchlist" };
		}

		await Watchlist.create({
			userId,
			symbol: symbol.toUpperCase(),
			company,
			addedAt: new Date(),
		});

		return { success: true, message: "Added to watchlist" };
	} catch (err) {
		console.error("addToWatchlist error:", err);
		return { success: false, error: "Failed to add to watchlist" };
	}
}

export async function removeFromWatchlist(symbol: string) {
	try {
		const userId = await getCurrentUserId();
		if (!userId) {
			return { success: false, error: "Not authenticated" };
		}

		await connectToDatabase();

		await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });

		return { success: true, message: "Removed from watchlist" };
	} catch (err) {
		console.error("removeFromWatchlist error:", err);
		return { success: false, error: "Failed to remove from watchlist" };
	}
}

export async function checkIsInWatchlist(symbol: string): Promise<boolean> {
	try {
		const userId = await getCurrentUserId();
		if (!userId) return false;

		await connectToDatabase();

		const item = await Watchlist.findOne({
			userId,
			symbol: symbol.toUpperCase(),
		});
		return !!item;
	} catch (err) {
		console.error("checkIsInWatchlist error:", err);
		return false;
	}
}

export async function getWatchlist() {
	try {
		const userId = await getCurrentUserId();
		if (!userId) {
			return { success: false, error: "Not authenticated", items: [] };
		}

		await connectToDatabase();

		const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();

		// Fetch metrics in parallel for all watchlist symbols
		const enrichedItems = await Promise.all(
			items.map(async (item) => {
				const metrics = await getStockMetrics(item.symbol);
				return {
					symbol: String(item.symbol),
					company: String(item.company),
					addedAt: item.addedAt.toISOString(),
					...metrics, // adds price, marketCap, peRatio, eps, divYield
				};
			}),
		);

		return { success: true, items: enrichedItems };
	} catch (err) {
		console.error("getWatchlist error:", err);
		return { success: false, error: "Failed to fetch watchlist", items: [] };
	}
}

export async function getWatchlistSymbolsByEmail(
	email: string,
): Promise<string[]> {
	if (!email) return [];
	try {
		const mongoose = await connectToDatabase();
		const db = mongoose.connection.db;
		if (!db) throw new Error("MongoDB connection not found");
		const user = await db
			.collection("user")
			.findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
		if (!user) return [];
		const userId = (user.id as string) || String(user._id || "");
		if (!userId) return [];
		const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
		return items.map((i) => String(i.symbol));
	} catch (err) {
		console.error("getWatchlistSymbolsByEmail error:", err);
		return [];
	}
}
