'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function InfluencerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Influencer Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Influencer Panelinde Hata</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          {error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-xl hover:bg-accent-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </button>
          <Link
            href="/influencer/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}


