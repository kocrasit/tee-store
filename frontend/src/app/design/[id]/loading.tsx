import { Spinner } from '@/components/ui';

export default function DesignLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">Ürün detayları yükleniyor...</p>
    </div>
  );
}



