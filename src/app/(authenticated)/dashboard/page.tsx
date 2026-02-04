import SignOutButton from "@/components/auth/signout-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Box } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (!session) {
    redirect("/auth");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <Box size={48} className="bg-neutral-800 text-neutral-400 p-2 rounded-lg" />
        <h1 className="my-3">Let's get started</h1>
        {user && <p>Hello {user.email}</p>}
        <p className="text-sm text-neutral-600">This page is only accessible to authenticated users.</p>
        <p className="text-sm text-neutral-600">You can customize this page by editing the file at (authenticated)/dashboard/page.tsx</p>
        <div className="mt-2 text-neutral-200">Go to <a href="/pricing"> Pricing</a>, <a href="/account"> Account</a> or <SignOutButton /></div>
        
      </div>
    </div>
  );
}