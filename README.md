# Daily Tracker PWA

Local-first PWA with a Today page, Dashboard, and an optional /api/coach-sync route for tips.

## Deploy (no local dev)
1. Create a GitHub repo and add these files.
2. Go to https://vercel.com/new → import the repo → Deploy.
3. Visit your live URL. In Chrome/Edge, click the Install icon to add as an app.

## Optional: secure the Coach endpoint
- Add env var in Vercel: COACH_KEY = your_random_string
- (Client dev only) NEXT_PUBLIC_COACH_DEV_KEY = same string, if you want to send the header from browser.

## Notes
- All data is stored in your browser (localStorage) unless you hit the endpoint.
- The coach route is a free stub; swap in a small model later if desired.
