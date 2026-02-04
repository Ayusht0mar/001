import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { products } from "@/lib/product";
import SignOutButton from "@/components/auth/signout-button";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function AccountPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    const subscription = await prisma.subscription.findFirst({
        where: { userId: session.user.id, status: "ACTIVE" },
    });

    const productId = subscription?.providerSubscriptionId;
    const plan = products.find((product) => product.product_id === productId);

    return (
        <div className="min-h-screen flex justify-center items-center bg-background">
            <div className="flex flex-col items-center w-full max-w-xl border border-neutral-900 bg-neutral-950/70 rounded-xl p-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-2 text-neutral-100">Account</h1>
                <p className="text-neutral-500 mb-6">Manage your account and subscription details.</p>

                <div className="w-full mb-6">
                    <div className="flex flex-col gap-2 bg-neutral-900/60 rounded-lg p-4">
                        <span className="text-neutral-400 text-sm">Email</span>
                        <span className="text-neutral-100 font-medium">{user?.email}</span>
                    </div>
                </div>

                <div className="w-full mb-6">
                    <div className="flex flex-col gap-2 bg-neutral-900/60 rounded-lg p-4">
                        <span className="text-neutral-400 text-sm">Subscription Status</span>
                        {subscription ? (
                            <span className="text-green-400 font-medium">Active</span>
                        ) : (
                            <span className="text-red-400 font-medium">No active subscription</span>
                        )}
                        {subscription && (
                            <>
                                <span className="text-neutral-400 text-sm mt-2">Current Plan</span>
                                <span className="text-neutral-100 font-medium">{plan?.name}</span>
                                <span className="text-neutral-400 text-sm mt-2">Renews / Ends</span>
                                <span className="text-neutral-100">{subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "-"}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex gap-4 w-full justify-between mt-4">
                    <Link href="/pricing" className="text-sm text-blue-400 hover:underline">Change Plan</Link>
                    <SignOutButton />
                </div>
            </div>
        </div>
    );
}
