import { NextResponse } from 'next/server';

export const runtime = 'edge';

const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 12_000;

type Msg = { role: 'user' | 'assistant'; content: string };

function chooseModel(text: string) {
  const t = text.toLowerCase();
  if (/code|coding|javascript|typescript|react|next\.js|python|bug|debug|api|sql|programmeer|programming/.test(t)) {
    return '~anthropic/claude-sonnet-latest';
  }
  if (text.length > 5000 || /analyseer|analyse|onderzoek|research|document/.test(t)) {
    return 'google/gemini-2.5-pro';
  }
  return 'openrouter/auto';
}

function isValidMessage(value: unknown): value is Msg {
  if (!value || typeof value !== 'object') return false;
  const message = value as Partial<Msg>;
  return (
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string' &&
    message.content.trim().length > 0 &&
    message.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(req: Request) {
  try {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY ontbreekt in Vercel Environment Variables.' },
        { status: 500 },
      );
    }

    const body = (await req.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) {
      return NextResponse.json({ error: 'Ongeldige berichtenlijst.' }, { status: 400 });
    }

    const messages = body.messages.filter(isValidMessage).slice(-MAX_MESSAGES);
    if (!messages.length) {
      return NextResponse.json({ error: 'Geen geldig bericht ontvangen.' }, { status: 400 });
    }

    const last = messages[messages.length - 1].content;
    const model = chooseModel(last);
    const system =
      'Je bent JARVIS, een capabele persoonlijke AI-assistent. Antwoord helder, praktisch en natuurlijk in het Nederlands tenzij de gebruiker een andere taal gebruikt. Denk mee, wees proactief en verzin geen feiten. Gebruik codeblokken waar dat nuttig is.';

    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'https://vercel.com',
        'X-Title': 'JARVIS Personal AI',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: system }, ...messages],
        temperature: 0.65,
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'OpenRouter request mislukt.' },
        { status: upstream.status },
      );
    }

    return NextResponse.json({
      content: data?.choices?.[0]?.message?.content || 'Geen antwoord ontvangen.',
      model: data?.model || model,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Onbekende serverfout.' },
      { status: 500 },
    );
  }
}
