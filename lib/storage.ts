const LS_SETTINGS = "dt_settings_v1";
const LS_ENTRIES  = "dt_entries_v1"; // map date => entry

export const todayISO = () => new Date().toISOString().slice(0,10);
export const ymd = (d: Date) => d.toISOString().slice(0,10);

export const DEFAULT_SETTINGS = {
  weeklyTheme: "Legendary is consistency, not perfection",
  categories: [
    { id: "breathe",   label: "Breathe",   type: "text", chips: ["Nose","Deep mouth in/out"] },
    { id: "move",      label: "Move",      type: "text", chips: ["Stretch","Lift","Walk","Golf"] },
    { id: "intention", label: "Intention", type: "text", chips: ["Positive action","Execute the plan"] },
    { id: "aplus",     label: "A+ Problem",type: "text" },
    { id: "protein",   label: "Protein",   type: "text", chips: ["Shakes","Whole foods"] },
  ],
  todoTemplate: ["Plan day","Focus block","Workout"],
  coachAutoSync: false,
};

export function loadSettings() {
  try { const raw = localStorage.getItem(LS_SETTINGS); if (raw) return JSON.parse(raw); } catch {}
  return DEFAULT_SETTINGS;
}
export function saveSettings(s: any) { localStorage.setItem(LS_SETTINGS, JSON.stringify(s)); }

export function loadEntry(date: string, settings: any) {
  try { const map = JSON.parse(localStorage.getItem(LS_ENTRIES) || "{}"); if (map[date]) return map[date]; } catch {}
  return {
    date,
    dayTheme: "Plan to Win",
    todos: (settings.todoTemplate || ["Plan day","Focus block","Workout"]).map((t: string, i: number)=>({ id:`t${i}`, text:t, checked:false })),
    fields: Object.fromEntries(settings.categories.map((c: any)=>[c.id,""])),
    worked:"", challenged:"", tomorrowAPlus:"",
  };
}
export function saveEntry(e: any) {
  const map = JSON.parse(localStorage.getItem(LS_ENTRIES) || "{}");
  map[e.date] = e;
  localStorage.setItem(LS_ENTRIES, JSON.stringify(map));
}
export function loadRecent(limit = 30) {
  const map = JSON.parse(localStorage.getItem(LS_ENTRIES) || "{}");
  const entries = Object.values(map) as any[];
  return entries.sort((a,b)=>a.date<b.date?1:-1).slice(0, limit);
}
