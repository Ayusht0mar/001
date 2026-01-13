import { prisma } from "@/lib/prisma";
import { mapPaymentStatus } from "./mappers";

export async function handlePaymentEvent(payload: any) {
  const data = payload.data;

  const providerPaymentId = data.payment_id;

  const subscription = await prisma.subscription.findUnique({
    where: {
      providerSubscriptionId: data.subscription_id,
    },
  });

  if (!subscription) return;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.upsert({
      where: { id: providerPaymentId },
      create: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        provider: "dodo",
        id: providerPaymentId,
        providerInvoiceId: data.invoice_id,
        providerPaymentMethod: data.payment_method,
        amount: data.amount,
        refundedAmount: data.refunded_amount ?? 0,
        currency: data.currency,
        status: mapPaymentStatus(data.status),
        paidAt: data.paid_at ? new Date(data.paid_at) : null,
      },
      update: {
        status: mapPaymentStatus(data.status),
        refundedAmount: data.refunded_amount ?? undefined,
        paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
        failureReason: data.failure_reason ?? undefined,
      },
    });

    // Promote subscription only on successful payment
    if (payment.status === "SUCCESS") {
      await tx.subscription.update({
        where: { id: subscription.id },
        data: { status: "ACTIVE" },
      });
    }
  });
}
