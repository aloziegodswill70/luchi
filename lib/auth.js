import { getServerSession } from 'next-auth';
import { authOptions as nextAuthOptions } from '@/app/api/auth/[...nextauth]/route';

export const authOptions = nextAuthOptions; // ✅ Export it

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  return session;
}
