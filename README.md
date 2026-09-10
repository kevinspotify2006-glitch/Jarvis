# JARVIS

Personal AI assistant built as a **Next.js App Router** application for deployment on **Vercel**.

## Stack

- Next.js 16
- React 19
- TypeScript
- Vercel
- OpenRouter

## AI architecture

The browser talks only to `/api/chat`. The OpenRouter key stays server-side in a Vercel environment variable. JARVIS routes requests between OpenRouter Auto, Claude and Gemini based on the task.

## Vercel setup

Import this GitHub repository into Vercel. Vercel natively detects Next.js projects and deploys them with zero-config framework support. citehttps://vercel.com/frameworks/nextjs

Add this environment variable in **Vercel → Project Settings → Environment Variables**:

`OPENROUTER_API_KEY=your_key_here`

Then redeploy.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
