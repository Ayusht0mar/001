import { Webhooks } from "@dodopayments/nextjs";
import { handleDodoWebhook } from "@/lib/webhooks/dodo/handler";

export const runtime = "nodejs";

if (!process.env.DODO_PAYMENTS_WEBHOOK_KEY) {
  throw new Error("Missing DODO_PAYMENTS_WEBHOOK_KEY");
}

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
  onPayload: handleDodoWebhook,
});
