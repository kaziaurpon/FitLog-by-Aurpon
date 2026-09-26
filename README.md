# 🏋️ FitLog — Workout Library

> A dark, no-nonsense gym companion — browse a workout library, build today's plan, save lifts for later, and watch your exercises, minutes, and calories add up in real time.

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)

🔗 **Live Site:** [https://your-deployed-url.vercel.app](https://your-deployed-url.vercel.app)
📂 **GitHub Repository:** [https://github.com/kaziaurpon/FitLog-by-Aurpon](https://github.com/kaziaurpon/FitLog-by-Aurpon)

---

## 📖 About the Project

FitLog is a responsive Next.js + TypeScript web app that helps people browse a library of twelve gym lifts, view detailed instructions and key specs for each one, lock lifts into a daily "Today's Plan" or save them for later, and track live progress — all with a clean, dark, gradient-accented UI built entirely with Tailwind CSS.

## 🛠️ Technologies Used

- **Next.js 14** (App Router) — routing, pages, and rendering
- **TypeScript** — static typing for safer, more predictable components
- **Tailwind CSS** — utility-first styling and full responsiveness
- **React Context + localStorage** — global state for the plan/saved lists that persists across reloads
- **FitLog REST API** — live workout data, loaded via `fetch` (`https://api.abcz.workers.dev/api/fitlog`)

## ✨ Features

1. **🏋️ Browse the Workout Library** — A responsive card grid (3 columns on desktop, 2 on tablet, 1 on mobile) shows each lift's image, muscle-group tags, equipment, and a duration/calories/rating stats row, all loaded live from the API instead of being hardcoded.

2. **📋 Detailed Workout Pages** — Clicking any card opens a dynamic `/workout/[id]` page with a large image, a key-specs panel (equipment, difficulty, sets, reps, duration, calories, rating), and a numbered list of step-by-step instructions.

3. **➕ Build Today's Plan & Save for Later** — "Add to today's plan" and "Save for later" buttons on the detail page instantly update the navbar's live Plan/Saved badge counters and show a toast notification, with a 5-lift daily cap enforced on the plan.

4. **✅ Manage Your Plan** — The My Plan dashboard shows live metrics (exercises, minutes, calories) for the active tab, with Today's Plan / Saved tabs, a "Mark as Done" button, and a ✕ "Remove" button on every card — each action confirmed with a toast, plus a friendly empty state when a tab has nothing in it.

5. **🔀 Sort, Search & Persist** — A "Sort By" dropdown (Duration/Calories/Rating) re-sorts the current list on both the home page and My Plan, a search box filters the library by name or tag, and everything is saved to `localStorage` so plans and saved items survive a page reload — all backed by a custom 404 page and loading states throughout.

## 🚀 Getting Started

Clone the repository and run it locally:

```bash
git clone https://github.com/kaziaurpon/FitLog-by-Aurpon.git
cd FitLog-by-Aurpon
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## 📦 Build for Production

```bash
npm run build
npm run start
```