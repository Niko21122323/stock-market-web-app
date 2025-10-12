"use client";

import { LayoutDashboardIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/actions/auth.actions";
import { Button } from "./ui/button";
import SearchCommand from "./SearchComponent";
import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";

const UserDropdown = ({
  user,
  initialStocks,
}: {
  user: User;
  initialStocks: StockWithWatchlistStatus[];
}) => {
  const router = useRouter();

  const handleSighOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:!bg-background cursor-pointer"
        >
          <Avatar className="size-10">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback className="text-primary text-sm font-bold">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-base text-foreground font-medium">
              {user.name}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-foreground bg-background border border-border">
        <DropdownMenuLabel>
          <div className="relative flex items-center gap-3 py-2">
            <Avatar className="h-10 w-10">
              {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
              <AvatarFallback className=" text-primary text-sm font-bold">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base text-foreground font-medium">
                {user.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={handleSighOut}
          className="py-4 text-foreground text-md font-semibold hover:focus:bg-primary hover:focus:text-background focus:bg-transparent transition-colors duration-300 ease-in-out cursor-pointer group"
        >
          <LogOut className="h-4 w-4 mr-2 group-hover:text-background transition-colors duration-300 ease-in-out" />
          Logout
        </DropdownMenuItem>

        {NAV_ITEMS.map(({ href, label }) => {
          if (href === "/search")
            return (
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                key="search-trigger"
                className="py-4 text-foreground text-md font-semibold hover:focus:bg-primary hover:focus:text-background focus:bg-transparent transition-colors duration-300 ease-in-out cursor-pointer group"
              >
                <SearchCommand
                  renderAs="text"
                  label="Search"
                  initialStocks={initialStocks}
                />
              </DropdownMenuItem>
            );

          return (
            <DropdownMenuItem
              key={href}
              className="py-4 hover:focus:bg-primary focus:bg-transparent transition-colors duration-300 ease-in-out cursor-pointer group"
            >
              <LayoutDashboardIcon className="h-4 w-4 mr-2 group-hover:text-background transition-colors duration-300 ease-in-out" />
              <Link
                href={href}
                className="text-foreground text-md font-semibold group-hover:text-background transition-colors duration-300 ease-in-out"
              >
                {label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
