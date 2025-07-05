import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(req) {
  const body = await req.json();

  const paystackSignature = req.headers.get('x-paystack-signature');
  const crypto = await import('crypto');

  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest('hex');

  // Verify signature
  if (hash !== paystackSignature) {
    return NextResponse.json({ status: 'invalid signature' }, { status: 400 });
  }

  const event = body.event;

  // Handle successful payment
  if (event === 'charge.success') {
    const email = body.data?.customer?.email;

    if (email) {
      try {
        // Set the user as pro in the database
        await prisma.user.update({
          where: { email },
          data: { isPro: true },
        });

        return NextResponse.json({ status: 'success' }, { status: 200 });
      } catch (error) {
        console.error('Database error updating user:', error);
        return NextResponse.json({ status: 'db error' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ status: 'ignored' }, { status: 200 });
}
