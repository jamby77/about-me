/**
 * Format a date-like value to yyyy-mm-dd for <input type="date"> fields.
 * Accepts Date, string (ISO), number (timestamp), or falsy to return "".
 */
export function formatDateInput(d: unknown): string {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d as any);
  if (isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
