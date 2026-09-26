# 💪 FitLog — Workout Library

FitLog is a dark, no-nonsense gym companion built for the B14-A6 assignment. Pick a lift from the library, lock it into today's plan or save it for later, and watch your exercises, minutes, and calories add up in real time — with everything persisted so your progress survives a page reload.

**Live Link:** _add your deployed URL here_
**GitHub Repository:** _add your repo URL here_

## 🛠️ Technologies Used

- **Next.js 14** (App Router) — routing, pages, and rendering
- **TypeScript** — type-safe components and data layer
- **Tailwind CSS** — styling and full responsiveness
- **React Context + localStorage** — global state for the plan/saved lists that persists across reloads
- **Fitlog REST API** — live workout data (`https://api.abcz.workers.dev/api/fitlog`)

## ✨ Key Features

1. **Dynamic workout library** — all lifts are fetched live from the API and rendered in a responsive 3×4 grid, each card showing image, category tags, equipment, and a duration/calories/rating stats row.
2. **Workout detail pages** — a two-column layout with a key-specs panel and step-by-step instructions for every lift, driven by a dynamic `/workout/[id]` route.
3. **Today's Plan & Saved tracking** — "Add to today's plan" and "Save for later" update live navbar badge counters and show toast notifications, with a 5-lift daily cap.
4. **My Plan dashboard** — live metrics (exercises, minutes, calories), tabbed Today's Plan / Saved views, Mark as Done and Remove actions, and a friendly empty state.
5. **Sort & search** — reorder the library by Duration, Calories, or Rating, or search by name/tag, plus a custom 404 page and loading states throughout.

## 📁 Project Structure

```
app/
  page.tsx              → Home (hero + library)
  workout/[id]/page.tsx → Workout detail page
  my-plan/page.tsx      → My Plan dashboard
  not-found.tsx         → Custom 404 page
components/             → Navbar, Footer, WorkoutCard, Toasts, SortDropdown, icons
lib/                    → types.ts, api.ts (fetch + normalize), store.tsx (state + localStorage)
public/assets/          → logo and hero illustration
```

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build

```bash
npm run build
npm run start
```
