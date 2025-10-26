"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import WatchlistButton from "@/components/WatchlistButton";

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

function formatMarketCap(cap: number | null | undefined) {
	if (!cap) return "-";

	if (cap >= 1e12) return `${(cap / 1e12).toFixed(2)}T`;
	if (cap >= 1e9) return `${(cap / 1e9).toFixed(2)}B`;
	if (cap >= 1e6) return `${(cap / 1e6).toFixed(2)}M`;
	if (cap >= 1e3) return `${(cap / 1e3).toFixed(2)}K`;
	return cap.toFixed(2);
}

function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function WatchlistTable({ items }: { items: WatchlistItem[] }) {
	if (!items || items.length === 0) {
		return (
			<div className="rounded-lg border border-border p-8 text-center">
				<p className="text-gray-400">No stocks in your watchlist.</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-border">
			<Table className="bg-background rounded-lg overflow-hidden">
				<TableHeader>
					<TableRow className="border-b border-border hover:bg-primary transition-colors duration-300 ease-in-out group">
						<TableHead className="text-foreground text-sm py-4 group-hover:text-background transition-colors duration-300 ease-in-out">
							Symbol
						</TableHead>
						<TableHead className="text-foreground text-sm py-4 group-hover:text-background transition-colors duration-300 ease-in-out">
							Company
						</TableHead>
						<TableHead className="text-foreground text-sm py-4 group-hover:text-background transition-colors duration-300 ease-in-out">
							Price
						</TableHead>
						<TableHead className="text-foreground text-sm py-4 group-hover:text-background transition-colors duration-300 ease-in-out">
							Market Cap
						</TableHead>
						<TableHead className="text-foreground text-sm py-4 group-hover:text-background transition-colors duration-300 ease-in-out">
							P/E
						</TableHead>
						<TableHead className="text-foreground text-sm py-4 group-hover:text-background transition-colors duration-300 ease-in-out">
							EPS
						</TableHead>
						<TableHead className="text-foreground text-sm py-4 group-hover:text-background transition-colors duration-300 ease-in-out">
							Div Yield
						</TableHead>
						<TableHead className="text-foreground text-sm py-4 group-hover:text-background transition-colors duration-300 ease-in-out">
							Added
						</TableHead>
						<TableHead className="text-foreground text-sm py-4 group-hover:text-background transition-colors duration-300 ease-in-out">
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{items.map((item) => (
						<TableRow
							key={item.symbol}
							className="border-t border-border/50 hover:bg-primary transition-colors duration-300 ease-in-out group"
						>
							<TableCell className="text-foreground/90 group-hover:text-background transition-colors duration-300 ease-in-out">
								<Link
									href={`/stocks/${item.symbol.toLowerCase()}`}
									className="font-medium text-primary group-hover:text-background transition-colors duration-300 ease-in-out"
								>
									{item.symbol}
								</Link>
							</TableCell>
							<TableCell className="text-foreground/90 group-hover:text-background transition-colors duration-300 ease-in-out">
								<span className="font-medium">{item.company}</span>
							</TableCell>
							<TableCell className="text-foreground/90 group-hover:text-background transition-colors duration-300 ease-in-out">
								{item.price ? `$${item.price.toFixed(2)}` : "-"}
							</TableCell>
							<TableCell className="text-foreground/90 group-hover:text-background transition-colors duration-300 ease-in-out">
								{formatMarketCap(item.marketCap)}
							</TableCell>
							<TableCell className="text-foreground/90 group-hover:text-background transition-colors duration-300 ease-in-out">
								{item.peRatio ?? "-"}
							</TableCell>
							<TableCell className="text-foreground/90 group-hover:text-background transition-colors duration-300 ease-in-out">
								{item.eps ?? "-"}
							</TableCell>
							<TableCell className="text-foreground/90 group-hover:text-background transition-colors duration-300 ease-in-out">
								{item.divYield ? `${(item.divYield * 100).toFixed(2)}%` : "-"}
							</TableCell>
							<TableCell className="text-foreground/90 group-hover:text-background transition-colors duration-300 ease-in-out">
								{formatDate(item.addedAt)}
							</TableCell>

							<TableCell className="text-foreground/90 group-hover:text-background transition-colors duration-300 ease-in-out">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="h-8 w-8 p-0 border border-border cursor-pointer"
										>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="border border-border bg-background"
									>
										<DropdownMenuItem
											asChild
											className="text-foreground hover:focus:bg-primary hover:focus:text-background transition-colors duration-300 ease-in-out cursor-pointer"
										>
											<Link href={`/stocks/${item.symbol.toLowerCase()}`}>
												View Details
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem className="text-foreground hover:focus:bg-primary hover:focus:text-background transition-colors duration-300 ease-in-out cursor-pointer">
											<WatchlistButton
												symbol={item.symbol}
												company={item.company}
												isInWatchlist={true}
												type="button"
											/>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
