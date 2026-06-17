// Truncate a name and append a possessive, preserving the original app's
// "Christ…'s" ellipsis behavior on the invite card (screen 20) for long names.
// e.g. truncatePossessive("Christopher") -> "Christ…'s"
//      truncatePossessive("Alex")        -> "Alex's"
export function truncatePossessive(name: string, maxChars = 6): string {
  const trimmed = (name ?? '').trim();
  if (!trimmed) return "your friend's";
  if (trimmed.length <= maxChars) return `${trimmed}'s`;
  return `${trimmed.slice(0, maxChars)}…'s`;
}

// Generic middle-safe truncation with a trailing ellipsis.
export function truncate(text: string, maxChars: number): string {
  const t = (text ?? '').trim();
  if (t.length <= maxChars) return t;
  return `${t.slice(0, Math.max(0, maxChars - 1))}…`;
}

export default truncate;
