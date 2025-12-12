import { Spinner } from '@/components/ui';

export default function CartLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">Sepet yükleniyor...</p>
    </div>
  );
}

