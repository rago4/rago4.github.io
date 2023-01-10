export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
