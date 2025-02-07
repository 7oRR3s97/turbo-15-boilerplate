export function getCurrencySymbol(currency?: string) {
  if (!currency) return "";
  switch (currency) {
    case "usd":
      return "$";
    case "eur":
      return "€";
    case "gbp":
      return "£";
    case "brl":
      return "R$";
    default:
      return currency;
  }
}

export function formatCurrencyWithoutCents({
  price,
  currency,
}: {
  price?: number;
  currency?: string;
}) {
  return `${getCurrencySymbol(currency)}${price ? price / 100 : 0}`;
}
