import { Spinner } from '@/components/ui';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600 animate-pulse">Yükleniyor...</p>
    </div>
  );
}



