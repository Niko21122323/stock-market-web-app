import Image from "next/image";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import UserDropdown from "./UserDropdown";

const Header = async ({ user }: { user: User }) => {
  const initialStocks = await searchStocks();

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container mx-auto flex justify-between items-center px-4 lg:px-6 py-8">
        <Link href="/">
          <Image
            src="/assets/icons/equify-logo-light.png"
            alt="company logo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>
        <UserDropdown user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
};

export default Header;
