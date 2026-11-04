# StudyBuddy

Study workspace front end: subjects, folders, notes, quizzes, summaries, progress,
and a study chat. Built with the Next.js App Router and wired to the StudyBuddy
Flask API.

## Stack

| Layer    | Tech                                                       |
| -------- | ---------------------------------------------------------- |
| Framework | Next.js 14 (App Router) · React 18 · TypeScript           |
| UI       | Tailwind CSS · Radix UI · shadcn/ui · Framer Motion · Recharts |
| State    | Zustand · React Hook Form · Zod                            |
| Auth     | NextAuth                                                   |
| Icons    | Lucide                                                     |

## Screens

- Landing, features, pricing, about, and contact pages
- Login and signup
- Student dashboard and admin dashboard
- Subjects list and subject detail
- Study chat
- Server routes for chat, quotes, and subjects

## Local setup

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the Flask API |
| `NEXT_PUBLIC_USE_MOCK_AUTH` | Set to `true` to use the mock auth helper |
| `BACKEND_URL` | Server-side backend URL for the avatar route |

Keep local values in `.env.local`. It is git-ignored.

## Related

The API lives in [studyBuddyBackend](https://github.com/Olamidipupo-favour/studyBuddyBackend).

## Status

Some views still read from mock data while the backend integration is finished.
