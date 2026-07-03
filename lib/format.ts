/** Shared, locale-aware formatters used across workspace, audit and report views. */

const locale = "de-DE";

export function formatNumber(value: number, fractionDigits = 0): string {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(safeValue);
}

export function formatCurrencyEur(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(safeValue);
}

export function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}

export function formatHours(value: number): string {
  return `${formatNumber(value, value < 10 ? 1 : 0)} Std.`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
