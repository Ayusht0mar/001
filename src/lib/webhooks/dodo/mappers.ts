export function mapPlan(productId: string) {
  switch (productId) {
    case "pro":
      return "PRO";
    case "pro_plus":
      return "PROPLUS";
    default:
      return "FREE";
  }
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
