import { products } from "@/lib/product";

// Prisma Plan enum type
export type Plan = "FREE" | "PRO" | "PROPLUS";


// Map product names to plan codes (Plan type)
const planNameMap: Record<string, Plan> = {
  "Pro Plan": "PRO",
  "Pro Plus Plan": "PROPLUS",
};

export function mapPlan(productId: string): Plan {
  const product = products.find((p) => p.product_id === productId);
  if (product && planNameMap[product.name]) {
    return planNameMap[product.name];
  }
  return "FREE";
}

export function mapSubscriptionStatus(status: string) {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    case "expired":
      return "EXPIRED";
    default:
      return "INCOMPLETE";
  }
}

export function mapPaymentStatus(status: string) {
  switch (status) {
    case "succeeded":
      return "SUCCESS";
    case "failed":
      return "FAILED";
    case "refunded":
      return "REFUNDED";
    default:
      return "PENDING";
  }
}
