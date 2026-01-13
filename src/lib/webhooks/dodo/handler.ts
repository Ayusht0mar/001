import { prisma } from "@/lib/prisma";
import { handleSubscriptionEvent } from "./subscription";
import { handlePaymentEvent } from "./payments";

export async function handleDodoWebhook(payload: any) {
  const { type } = payload;

  switch (type) {
    case "subscription.active":
    case "subscription.updated":
    case "subscription.trialing":
    case "subscription.canceled":
      await handleSubscriptionEvent(payload);
      break;

    case "payment.succeeded":
    case "payment.failed":
    case "payment.refunded":
      await handlePaymentEvent(payload);
      break;

    default:
      // Always return 200 for unknown events
      console.log("Unhandled Dodo webhook:", type);
  }
}
