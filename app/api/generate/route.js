// app/api/generate/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { topic, type } = await req.json();
  const userEmail = session.user.email;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { generations: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!user.isPro && user.generations.length >= 3) {
    return NextResponse.json({ error: 'Generation limit reached' }, { status: 403 });
  }

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful assistant...' },
        { role: 'user', content: topic },
      ],
    }),
  });

  const data = await groqRes.json();
  const result = data?.choices?.[0]?.message?.content;

  if (!type || typeof type !== "string") {
  return NextResponse.json({ error: "Invalid or missing 'type'" }, { status: 400 });
}

await prisma.generation.create({
  data: {
    type,
    content: result,
    userId: user.id,
  },
});


  return NextResponse.json({ result });
}
