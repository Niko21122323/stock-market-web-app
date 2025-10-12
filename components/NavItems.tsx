"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import SearchCommand from "./SearchComponent";

const NavItems = ({
  initialStocks,
}: {
  initialStocks: StockWithWatchlistStatus[];
}) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
      {NAV_ITEMS.map(({ href, label }) => {
        if (href === "/search")
          return (
            <li
              key="search-trigger"
              className="py-4 text-foreground text-md font-semibold hover:bg-primary hover:text-background focus:bg-transparent transition-colors duration-300 ease-in-out cursor-pointer group"
            >
              <SearchCommand
                renderAs="text"
                label="Search"
                initialStocks={initialStocks}
              />
            </li>
          );

        return (
          <li
            key={href}
            className="py-4 text-foreground text-md font-semibold hover:focus:bg-primary hover:focus:text-background focus:bg-transparent transition-colors duration-300 ease-in-out cursor-pointer group"
          >
            <Link
              href={href}
              className={`hover:text-primary transition-colors text-base md:text-lg xl:text-xl font-semibold ${
                isActive(href) ? "text-white" : "text-gray-300"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
