import { prisma } from "@/lib/prisma";
import { Webhooks } from "@dodopayments/nextjs";



export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,
  onSubscriptionActive: async (payload) => {
    console.log("Received onSubscriptionActive webhook:", payload);

    const user = await prisma.user.findUnique({
      where: { email: payload.data.customer.email },
    });

    
    if (user) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          status: "active",
          dodoSubscriptionId: payload.data.subscription_id,
          productId: payload.data.product_id,
          startedAt: new Date(),
        },
      });
    } 
    
    // TODO: Update your database, enable features, send emails, etc.
    },
  onPaymentSucceeded: async (payload) => {
    console.log("Received onPaymentSucceeded webhook:", payload);

    const user = await prisma.user.findUnique({
      where: { email: payload.data.customer.email },
    });

    if (user) {
      await prisma.subscription.updateMany({
        where: {
          userId: user.id,
          dodoSubscriptionId: payload.data.subscription_id ?? undefined,
        },
        data: { status: "active" },
      });
    }
  },
});