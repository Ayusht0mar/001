import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { products } from "@/lib/product";

export default async function AccountPage() {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const subscription = await prisma.subscription.findFirst({
        where: { userId: session?.user.id, status: "ACTIVE" },
    });

    const productId = subscription?.providerSubscriptionId;

    const plan = products.find((product) => product.product_id === productId)?.name;

    return (
        <div>
            <h1>Account Page</h1>
            <p>This is the account page for authenticated users.</p>

            {session && <p>User Email: {session.user.email}</p>}

            {subscription ? (
                <p>Your subscription is active.</p>
            ) : (
                <p>You do not have an active subscription.</p>
            )}

            <p>{subscription?.currentPeriodEnd?.toString()}</p>
            <p>Current Plan: {plan}</p> 
        </div>
    );
}
