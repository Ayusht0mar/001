import { prisma } from "@/lib/prisma";
import { mapPlan, mapSubscriptionStatus } from "./mappers";

export async function handleSubscriptionEvent(payload: any) {
  const data = payload.data;

  const providerSubscriptionId = data.subscription_id;

  // Lookup subscription directly by provider ID
  const existing = await prisma.subscription.findUnique({
    where: { providerSubscriptionId },
  });

  // Monotonic guard
  if (
    existing &&
    ["CANCELED", "EXPIRED"].includes(existing.status)
  ) {
    return;
  }

  // IMPORTANT:
  // userId must already be known (stored during checkout)
  const subscription = await prisma.subscription.upsert({
    where: { providerSubscriptionId },
    create: {
      userId: data.metadata.user_id, // <- critical design choice
      provider: "dodo",
      providerSubscriptionId,
      plan: mapPlan(data.product_id),
      status: mapSubscriptionStatus(data.status),
      startedAt: new Date(data.started_at),
      currentPeriodEnd: new Date(data.current_period_end),
      trialEndsAt: data.trial_ends_at
        ? new Date(data.trial_ends_at)
        : null,
    },
    update: {
      status: mapSubscriptionStatus(data.status),
      currentPeriodEnd: new Date(data.current_period_end),
      cancelledAt: data.cancelled_at
        ? new Date(data.cancelled_at)
        : undefined,
    },
  });

  return subscription;
}
