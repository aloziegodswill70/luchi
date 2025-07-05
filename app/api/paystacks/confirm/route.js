// app/api/paystacks/confirm/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { isPro: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Pro upgrade failed:', err);
    return NextResponse.json({ error: 'Upgrade failed' }, { status: 500 });
  }
}
