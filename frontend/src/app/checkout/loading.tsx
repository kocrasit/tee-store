import { Spinner } from '@/components/ui';

export default function CheckoutLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">Ödeme sayfası yükleniyor...</p>
    </div>
  );
}


