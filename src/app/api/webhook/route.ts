import { prisma } from "@/lib/prisma";
import { Webhooks } from "@dodopayments/nextjs";

export const runtime = "nodejs";

if (!process.env.DODO_PAYMENTS_WEBHOOK_KEY) {
  throw new Error("Missing DODO_PAYMENTS_WEBHOOK_KEY");
}

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,

  onSubscriptionActive: async (payload) => {
    console.log("onSubscriptionActive:", payload);

    const user = await prisma.user.findUnique({
      where: { email: payload.data.customer.email },
    });

    if (!user) return;

    await prisma.subscription.create({
      data: {
        userId: user.id,
        status: "active",
        dodoSubscriptionId: payload.data.subscription_id,
        productId: payload.data.product_id,
        startedAt: new Date(),
      },
    });
  },

  onPaymentSucceeded: async (payload) => {
    console.log("onPaymentSucceeded:", payload);

    const user = await prisma.user.findUnique({
      where: { email: payload.data.customer.email },
    });

    if (!user) return;

    await prisma.subscription.updateMany({
      where: {
        userId: user.id,
        dodoSubscriptionId: payload.data.subscription_id ?? undefined,
      },
      data: { status: "active" },
    });
  },
});
