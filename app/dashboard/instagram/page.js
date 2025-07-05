'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import Spinner from '@/components/spinner';

export default function InstagramPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLimitMessage, setShowLimitMessage] = useState(false);


  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setResult('Please enter a niche or idea first.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `Generate Instagram content for: ${prompt}`,
          type: 'instagram',
        }),
      });

      const data = await res.json();
         
      if (data?.error === 'Generation limit reached') {
         setShowLimitMessage(true);
      }

    
      if (res.ok && data.result) {
        setResult(data.result);
      } else {
        setResult(data.error || 'No content generated.');
      }
    } catch (error) {
      setResult('Something went wrong while generating content.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(result, 10, 10);
    doc.save('instagram-content.pdf');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Instagram Content Planner</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="E.g. Content ideas for women entrepreneurs in Nigeria..."
        className="w-full border rounded p-3 mb-4"
        rows={4}
      />

      <button
        onClick={handleGenerate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? <Spinner /> : 'Generate'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Generated Content</h2>
          <pre className="whitespace-pre-wrap">{result}</pre>

          <button
            onClick={downloadPDF}
            className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Download as PDF
          </button>
        </div>
      )}

      {showLimitMessage && (
    <div className="mt-6 p-4 border border-red-300 bg-red-100 rounded shadow text-red-800">
    <p className="mb-2 font-medium">You’ve reached your free usage limit.</p>
    <p className="mb-4">Please upgrade to Pro to continue generating content.</p>
    <button
      onClick={() => {
        window.location.href = '/upgrade';
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Upgrade to Pro
      </button>
    </div>
  )}

    </div>
  );
}
