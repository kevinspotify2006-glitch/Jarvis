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

Import this GitHub repository into Vercel. Vercel natively detects Next.js projects and provides framework-aware deployment support.

Add this environment variable in **Vercel → Project Settings → Environment Variables**:

`OPENROUTER_API_KEY=your_key_here`

Apply it to the environments you use and redeploy after changing it. Never expose the key with a `NEXT_PUBLIC_` prefix.

You can use `.env.example` as the local configuration template.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

Before calling a release production-ready, verify:

1. `npm run build` completes successfully.
2. The deployed Vercel application loads without client errors.
3. `OPENROUTER_API_KEY` is configured in the required Vercel environments.
4. A normal chat request returns an assistant response.
5. Invalid chat payloads return a controlled 4xx response.
