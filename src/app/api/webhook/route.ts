import { Webhooks } from "@dodopayments/nextjs";
import { prisma } from "@/lib/prisma";

type PlanType = "FREE" | "PRO" | "PROPLUS";

// Map Dodo product IDs to our internal Plan enum
const PRODUCT_TO_PLAN: Record<string, PlanType> = {
  "pdt_0NUU2ubxMAJtwwlx8xvxs": "PRO", // Basic Plan
  "pdt_0NUU2ubxMAJtwwlx8xvxy": "PROPLUS", // Pro Plan
};

function getPlanForProduct(productId: string | null | undefined): PlanType {
  if (productId && PRODUCT_TO_PLAN[productId]) {
    return PRODUCT_TO_PLAN[productId];
  }
  return "FREE";
}

async function updateUserByEmail(
  email: string | null | undefined,
  data: {
    plan?: PlanType;
  },
) {
  if (!email) {
    console.warn("Webhook payload missing customer email, skipping user update.");
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.warn("No user found for webhook email, skipping user update:", email);
    return;
  }

  await prisma.user.update({
    where: { email },
    data,
  });
}

async function upsertSubscriptionForEmail(
  email: string | null | undefined,
  subscription: any,
) {
  if (!email) {
    console.warn(
      "Webhook subscription payload missing customer email, skipping subscription upsert.",
    );
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.warn(
      "No user found for webhook subscription email, skipping subscription upsert:",
      email,
    );
    return;
  }

  const dodoSubscriptionId = subscription?.subscription_id as
    | string
    | undefined;

  if (!dodoSubscriptionId) {
    console.warn(
      "Webhook subscription payload missing subscription_id, skipping subscription upsert.",
    );
    return;
  }

  const productId = subscription?.product_id as string | undefined;

  await prisma.subscription.upsert({
    where: { dodoSubscriptionId },
    create: {
      userId: user.id,
      dodoSubscriptionId,
      productId: productId ?? "",
      status: (subscription?.status as string | undefined) ?? "pending",
      startedAt:
        (subscription?.created_at as Date | undefined) ?? new Date(),
      nextBillingDate: subscription?.next_billing_date as Date | null,
      cancelledAt: subscription?.cancelled_at as Date | null,
    },
    update: {
      productId: productId ?? "",
      status: (subscription?.status as string | undefined) ?? "pending",
      nextBillingDate: subscription?.next_billing_date as Date | null,
      cancelledAt: subscription?.cancelled_at as Date | null,
    },
  });
}

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,

  // Fired when a subscription becomes active (plan purchased)
  onSubscriptionActive: async (payload) => {
    console.log("Received onSubscriptionActive webhook:", payload);

    const subscription = payload.data;
    const customerEmail = subscription.customer.email;

    const plan = getPlanForProduct(subscription.product_id as string | undefined);

    await updateUserByEmail(customerEmail, {
      plan,
    });

    await upsertSubscriptionForEmail(customerEmail, subscription);
  },

  // General payment success handler (covers successful charges)
  onPaymentSucceeded: async (payload) => {
    console.log("Received onPaymentSucceeded webhook:", payload);

    // Subscription events are responsible for updating user plan & subscriptions.
    // Payment success is logged here but does not mutate user state directly.
  },

  // Payment failed (card declined, etc.)
  onPaymentFailed: async (payload) => {
    console.log("Received onPaymentFailed webhook:", payload);

    // Subscription.failed / subscription.cancelled events will update DB state.
  },

  // Payment cancelled before completion
  onPaymentCancelled: async (payload) => {
    console.log("Received onPaymentCancelled webhook:", payload);

    // No direct DB mutation here; subscription events handle status changes.
  },

  // Subscription cancelled (e.g. user or system cancels plan)
  onSubscriptionCancelled: async (payload) => {
    console.log("Received onSubscriptionCancelled webhook:", payload);

    const subscription = payload.data;
    const customerEmail = subscription.customer.email;

    await updateUserByEmail(customerEmail, {
      // Downgrade user back to FREE when subscription is cancelled
      plan: "FREE",
    });

    await upsertSubscriptionForEmail(customerEmail, subscription);
  },

  // Subscription failed (e.g. repeated payment failures)
  onSubscriptionFailed: async (payload) => {
    console.log("Received onSubscriptionFailed webhook:", payload);

    const subscription = payload.data;
    const customerEmail = subscription.customer.email;

    await updateUserByEmail(customerEmail, {
      // Treat failed subscription as loss of paid status
      plan: "FREE",
    });

    await upsertSubscriptionForEmail(customerEmail, subscription);
  },
});