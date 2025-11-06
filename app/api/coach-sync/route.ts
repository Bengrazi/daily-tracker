import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  const needKey = process.env.COACH_KEY;
  if (needKey && auth !== needKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const entry = await req.json();

  // Simple, free stub. Swap with real LLM if you want.
  const anyTodoOpen = (entry?.todos || []).some((t: any) => !t.done);
  const theme = entry?.day_theme || "Plan to Win";
  const nudge = anyTodoOpen ? "Block 45 minutes to crush the first task." : "Lock in the win: 1-line recap.";

  return NextResponse.json({ ok: true, theme, nudge });
}
