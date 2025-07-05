'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!session?.user?.email) {
      alert('You must be logged in to upgrade.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/paystacks/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await res.json();

      if (data?.authorization_url) {
        router.push(data.authorization_url); // Redirect to Paystack payment page
      } else {
        alert('Something went wrong while initializing Paystack payment.');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start Paystack checkout session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white bg-gradient-to-br from-green-700 via-red-600 to-yellow-500 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="text-lg">
        Hello, <span className="font-semibold">{session?.user?.name || 'User'}</span> 👋🏽
      </p>
      <p className="mt-2 mb-6">
        Use the sidebar to access your AI tools — CV + Cover Letter Generator, Instagram Planner, and Business Ideas.
      </p>

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded shadow-lg disabled:opacity-50"
      >
        {loading ? 'Redirecting to Paystack...' : 'Upgrade to Pro 🚀 – ₦500/month'}
      </button>
    </div>
  );
}
