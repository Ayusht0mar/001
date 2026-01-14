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
        amount: data.total_amount,
        refundedAmount: 0,
        currency: data.currency,
        status: mapPaymentStatus(data.status),
        paidAt: data.status === "succeeded" ? new Date(data.created_at) : null,
      },
      update: {
        status: mapPaymentStatus(data.status),
        ...(data.refunds && data.refunds.length > 0 && {
          refundedAmount: data.refunds.reduce((sum: number, refund: any) => sum + refund.amount, 0),
        }),
        ...(data.status === "succeeded" && {
          paidAt: new Date(data.created_at),
        }),
        ...(data.error_message && {
          failureReason: data.error_message,
        }),
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
