// app/api/history/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const history = await prisma.generation.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ history });
}
