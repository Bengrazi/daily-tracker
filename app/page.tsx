"use client";
import { useEffect, useMemo, useState } from "react";
import { computeScore } from "@/lib/score";
import { DEFAULT_SETTINGS, loadEntry, loadRecent, loadSettings, saveEntry, saveSettings, todayISO } from "@/lib/storage";
import { tryCoachSync } from "@/lib/coach";

function Section({ title, right, children }: { title: string; right?: any; children: any }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}
function Chip({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick} className="px-3 py-1 rounded-full border text-sm mr-2 mb-2">{label}</button>;
}

export default function Page() {
  const [settings, setSettings] = useState<any>(DEFAULT_SETTINGS);
  const [date, setDate] = useState<string>(todayISO());
  const [entry, setEntry] = useState<any>(loadEntry(todayISO(), DEFAULT_SETTINGS));
  const [themeResp, setThemeResp] = useState<any>(null);

  useEffect(() => { const s = loadSettings(); setSettings(s); setEntry(loadEntry(date, s)); }, []);
  useEffect(() => { setEntry(loadEntry(date, settings)); }, [date]);

  const score = useMemo(() => computeScore(entry), [entry]);

  const updateField = (id: string, value: string) => setEntry((e: any) => ({ ...e, fields: { ...e.fields, [id]: value } }));
  const updateTodo = (i: number, patch: any) => setEntry((e: any) => { const todos = [...e.todos]; todos[i] = { ...todos[i], ...patch }; return { ...e, todos }; });

  const save = async () => {
    const e = { ...entry, score };
    saveEntry(e);
    if (settings.coachAutoSync) {
      const res = await tryCoachSync(e, settings);
      if (res.ok) setThemeResp(res.data);
    }
  };

  // quick streak (last 7 days with entries)
  const streak = (() => {
    const recent = loadRecent(7);
    return recent.filter((r: any) => !!r.date).length;
  })();

  return (
    <>
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Today</h1>
          <p className="text-sm text-slate-500">Week Theme: {settings.weeklyTheme}</p>
          <p className="text-xs text-slate-500">Streak (last 7 days): {streak}</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" className="px-2 py-1 rounded-lg border bg-white" value={date} onChange={e => setDate(e.target.value)} />
          <a className="px-3 py-1 rounded-lg border" href="/dashboard">Dashboard</a>
        </div>
      </header>

      <div className="text-xs text-slate-500 -mt-2 mb-2">Coach Sync: {settings.coachAutoSync ? "ON" : "OFF"}</div>

      <Section title="Day Theme">
        <input value={entry.dayTheme} onChange={e => setEntry({ ...entry, dayTheme: e.target.value })} className="w-full px-3 py-2 rounded-lg border" />
        {themeResp?.theme && (
          <div className="mt-2 text-sm text-slate-600"><b>Coach:</b> {themeResp.theme} — {themeResp.nudge}</div>
        )}
      </Section>

      <Section title="To-Dos" right={<span className="text-sm text-slate-500">check to complete</span>}>
        {(entry.todos || []).map((t: any, i: number) => (
          <div key={t.id} className="flex items-center gap-2 mb-2">
            <input type="checkbox" className="h-5 w-5" checked={t.checked} onChange={e => updateTodo(i, { checked: e.target.checked })} />
            <input className={`flex-1 px-3 py-2 rounded-lg border ${t.checked ? "line-through text-slate-400" : ""}`} value={t.text} onChange={e => updateTodo(i, { text: e.target.value })} />
            <button className="text-sm" onClick={() => setEntry((e: any) => ({ ...e, todos: e.todos.filter((_: any, j: number) => j !== i) }))}>Remove</button>
          </div>
        ))}
        <button className="text-sm underline" onClick={() => setEntry((e: any) => ({ ...e, todos: [...e.todos, { id: `t${e.todos.length}`, text: "New task", checked: false }] }))}>+ Add To-Do</button>
      </Section>

      <Section title="Top Categories">
        {settings.categories.map((c: any) => (
          <div key={c.id} className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">{c.label}</label>
              <div>{(c.chips || []).map((ch: string) => (<Chip key={ch} label={ch} onClick={() => updateField(c.id, (entry.fields[c.id] ? entry.fields[c.id] + ", " : "") + ch)} />))}</div>
            </div>
            <input className="w-full px-3 py-2 rounded-lg border" value={entry.fields[c.id] || ""} onChange={e => updateField(c.id, e.target.value)} />
          </div>
        ))}
      </Section>

      <Section title="Reflect (EOD)">
        <textarea className="w-full px-3 py-2 rounded-lg border mb-2" rows={2} placeholder="What worked?" value={entry.worked || ""} onChange={e => setEntry({ ...entry, worked: e.target.value })} />
        <textarea className="w-full px-3 py-2 rounded-lg border mb-2" rows={2} placeholder="What challenged me?" value={entry.challenged || ""} onChange={e => setEntry({ ...entry, challenged: e.target.value })} />
        <input className="w-full px-3 py-2 rounded-lg border" placeholder="Tomorrow A+ problem" value={entry.tomorrowAPlus || ""} onChange={e => setEntry({ ...entry, tomorrowAPlus: e.target.value })} />
      </Section>

      <Section title="Score & Actions" right={<span className="text-sm text-slate-500">auto-calculates</span>}>
        <div className="flex items-center justify-between">
          <div className="text-4xl font-extrabold">{score}</div>
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 rounded-xl bg-slate-900 text-white">Save Today</button>
          </div>
        </div>
      </Section>
    </>
  );
}
