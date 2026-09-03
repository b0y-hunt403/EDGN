export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatMoney(
  amount: number,
  currency = "ETB",
  compact = false,
): string {
  if (compact) {
    if (amount >= 1_000_000_000) {
      return currency + " " + (amount / 1_000_000_000).toFixed(2) + "B";
    }
    if (amount >= 1_000_000) {
      return currency + " " + (amount / 1_000_000).toFixed(2) + "M";
    }
  }
  return (
    currency +
    " " +
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  );
}

export function humanizeStatus(status: string): string {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
