"use client";
import { loadRecent } from "@/lib/storage";

export default function Dashboard() {
  const entries = loadRecent(30);
  const avg = entries.length ? Math.round(entries.reduce((a: any, b: any) => a + (b.score || 0), 0) / entries.length) : 0;
  const completion = entries.length
    ? Math.round(
        entries.reduce((acc: number, e: any) => acc + (e.todos.filter((t: any) => t.checked).length / Math.max(e.todos.length, 1)), 0) / entries.length * 100
      )
    : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border"><div className="text-sm">Avg Score</div><div className="text-3xl font-bold">{avg}</div></div>
        <div className="bg-white p-4 rounded-xl border"><div className="text-sm">To-Do Completion</div><div className="text-3xl font-bold">{completion}%</div></div>
      </div>
      <a href="/" className="underline text-sm">← Back to Today</a>
    </div>
  );
}
