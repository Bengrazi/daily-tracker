export async function tryCoachSync(entry: any, settings: any) {
  try {
    const res = await fetch("/api/coach-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // For prod, set COACH_KEY in Vercel and send it from client if you want:
        Authorization: process.env.NEXT_PUBLIC_COACH_DEV_KEY ? `Bearer ${process.env.NEXT_PUBLIC_COACH_DEV_KEY}` : "",
      },
      body: JSON.stringify({
        version: 1,
        date: entry.date,
        weekly_theme: settings.weeklyTheme,
        day_theme: entry.dayTheme,
        fields: settings.categories.map((c: any) => ({ id: c.id, label: c.label, value: entry.fields[c.id] || "" })),
        todos: entry.todos.map((t:any)=>({ text:t.text, done:t.checked })),
        score: entry.score || 0,
        reflections: { worked: entry.worked||"", challenged: entry.challenged||"", tomorrowAPlus: entry.tomorrowAPlus||"" },
      }),
    });
    if (!res.ok) return { ok:false, message:`coach-sync ${res.status}` };
    const data = await res.json().catch(()=>({}));
    return { ok:true, data };
  } catch (e) { return { ok:false, message:"no endpoint" }; }
}
