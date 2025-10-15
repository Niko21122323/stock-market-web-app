import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/better-auth/auth";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) redirect("/");

  return (
    <main className="relative overflow-hidden grid lg:grid-cols-2 gap-10 items-center lg:h-screen lg:overflow-y-auto max-lg:py-10 px-4 lg:px-6">
      <section className="w-full h-full">
        <div className="relative lg:max-w-[640px] mx-auto h-full w-full flex flex-col justify-center">
          <Link href="/" className="pb-8">
            <Image
              src="/assets/icons/equify-logo-light.png"
              alt="company logo"
              width={140}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          <div className="">{children}</div>
        </div>
      </section>

      <section className="flex flex-col justify-center h-full lg:px-10">
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <blockquote className="text-muted-foreground">
            Equify keeps me one step ahead of the market. The alerts are
            accurate, fast, and help me spot real opportunities.
          </blockquote>
          <div className="flex items-center justify-between pt-6">
            <div>
              <cite className="text-foreground text-lg font-semibold">
                - Jenna L.
              </cite>
              <p className="max-md:text-xs text-muted-foreground">
                Swing Trader
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  src="/assets/icons/star.svg"
                  alt="star icon"
                  key={star}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <Image
            src="/assets/images/dashboard-image.webp"
            alt="Dashboard Preview"
            width={1440}
            height={1150}
            className=""
          />
        </div>
      </section>
    </main>
  );
};

export default Layout;
