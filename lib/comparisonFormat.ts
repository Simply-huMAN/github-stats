const numberFormatter = new Intl.NumberFormat("en-US");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

export function formatComparisonNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatComparisonDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}
