import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
    <div>
      <h1>Dashboard</h1>
      <p>This page is only accessible to authenticated users.</p>
      {user && <p>Welcome, {user.email}!</p>}
      

      <a href="/pricing">Go to Pricing</a>


    </div>
  );
}