'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (!session) {
    return <div className="p-4 text-red-500">You must be logged in to view your profile.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-green-700 mb-4">My Profile</h1>

      <div className="bg-white p-4 rounded shadow-md mb-6">
        <p><strong>Name:</strong> {session.user.name}</p>
        <p><strong>Email:</strong> {session.user.email}</p>
      </div>

      <h2 className="text-xl font-semibold text-green-600 mb-2">Generated History</h2>

      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500">No generated content yet.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((item) => (
            <li key={item.id} className="border border-gray-200 p-3 rounded shadow-sm bg-white">
              <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
              <div className="font-semibold text-green-800 mb-1 capitalize">{item.type}</div>
              <pre className="text-sm whitespace-pre-wrap text-gray-700">{item.result}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
