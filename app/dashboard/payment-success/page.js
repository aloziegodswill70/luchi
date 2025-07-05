'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [verifying, setVerifying] = useState(true);
  const [alreadyPro, setAlreadyPro] = useState(false);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000); // Auto-dismiss toast after 4s
  };

  useEffect(() => {
    const checkAndUpgrade = async () => {
      if (status === 'loading') return;

      if (session?.user?.isPro) {
        setVerifying(false);
        setAlreadyPro(true);
        showToast('You are already a Pro user 👑');
        return;
      }

      try {
        const res = await fetch('/api/paystacks/confirm', { method: 'POST' });
        const data = await res.json();

        if (res.ok) {
          await update(); // Refresh session
          showToast('🎉 Payment successful! You are now Pro ✅');
          setTimeout(() => router.push('/dashboard'), 3000);
        } else {
          console.error(data.error);
          setError(true);
          showToast('❌ Error confirming payment');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(true);
        showToast('❌ Something went wrong');
      } finally {
        setVerifying(false);
      }
    };

    checkAndUpgrade();
  }, [status, session, update, router]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white text-center p-6">
      {/* Spinner while verifying */}
      {verifying && !error && (
        <div className="flex flex-col items-center gap-4 text-yellow-600">
          <div className="animate-spin h-8 w-8 border-4 border-yellow-600 border-t-transparent rounded-full" />
          <p className="text-lg font-semibold">⏳ Verifying your payment...</p>
        </div>
      )}

      {/* Success */}
      {!verifying && !error && !alreadyPro && (
        <p className="text-lg text-green-600 font-bold">
          🎉 Payment successful! Redirecting...
        </p>
      )}

      {/* Already Pro */}
      {alreadyPro && (
        <p className="text-lg text-blue-700 font-bold">
          👑 You're already a Pro user — no need to upgrade again.
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-lg text-red-600 font-bold">
          ❌ Something went wrong. Please contact support.
        </p>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
