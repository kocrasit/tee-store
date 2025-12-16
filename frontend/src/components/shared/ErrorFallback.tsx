'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  title = 'Bir hata oluştu',
  message = 'Sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.',
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6 max-w-md">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Tekrar Dene
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorFallback;



