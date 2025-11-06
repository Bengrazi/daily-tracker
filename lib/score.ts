export function computeScore(entry: any) {
  const completed = (entry.todos || []).filter((t: any) => t.checked).length;
  const base = Math.round((completed / Math.max((entry.todos || []).length || 3, 1)) * 60);
  const hasIntention = entry.fields?.intention?.trim() ? 10 : 0;
  const exercise = entry.fields?.move?.trim() ? 20 : 0;
  const aplus = entry.fields?.aplus?.trim() ? 10 : 0;
  return Math.min(100, base + hasIntention + exercise + aplus);
}
