"use client"
import { signOut, useSession } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";

export default  function Home() {

  const session = useSession();

  const handleSignout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      alert(`Sign out failed: ${error}`);
    }
    redirect("/bitch");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Users List
          </h1>

          
          {session.data?.user ? (
            <div className="flex flex-col gap-4">
              <p className="text-lg text-neutral-700 dark:text-neutral-300">
                Welcome, {session.data.user.name || session.data.user.email}!
              </p>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <h2 className="font-medium mb-2">Your Details:</h2>
                <p><strong>Email:</strong> {session.data.user.email}</p>
                <p><strong>Name:</strong> {session.data.user.name || "N/A"}</p>
              </div>
            </div>
          ) : (
            <p className="text-base text-neutral-700 dark:text-neutral-300">
              Please sign in to view your user details.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>

        <button onClick={handleSignout}>
          Sign Out
        </button>
      </main>
    </div>
  );
}
