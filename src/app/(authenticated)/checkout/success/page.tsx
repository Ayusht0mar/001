"use client";

import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const subscriptionId = searchParams.get("subscription_id");
    const status = searchParams.get("status");

// Check if subscriptionId and status are present and render accordingly

    return (
        <div>
            <h1>Checkout Success</h1>
            <p>Your checkout was successful. Thank you for your purchase!</p>

            <pre>
                subscription_id: {subscriptionId ?? "null"}
                {"\n"}
                status: {status ?? "null"}
            </pre>

            {subscriptionId && (
                <p>
                    Subscription ID: <strong>{subscriptionId}</strong>
                </p>
            )}
        </div>
    );
}