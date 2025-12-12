import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0 mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center gap-3">
                        <FileText className="h-8 w-8 text-indigo-600" />
                        Kullanım Şartları
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Son Güncelleme: 27 Kasım 2024
                    </p>
                </div>

                <div className="prose prose-indigo max-w-none text-gray-600">
                    <h3>1. Giriş</h3>
                    <p>
                        TeeStore web sitesine hoş geldiniz. Bu web sitesini kullanarak, aşağıda belirtilen kullanım şartlarını kabul etmiş sayılırsınız. Lütfen bu şartları dikkatlice okuyunuz.
                    </p>

                    <h3>2. Hizmetlerin Kullanımı</h3>
                    <p>
                        Web sitemizi sadece yasal amaçlar için ve bu kullanım şartlarına uygun olarak kullanabilirsiniz. Sitemizi, başkalarının haklarını ihlal edecek veya sitemizin işleyişini bozacak şekilde kullanamazsınız.
                    </p>

                    <h3>3. Fikri Mülkiyet Hakları</h3>
                    <p>
                        Sitemizde yer alan tüm içerik (metinler, görseller, logolar, vb.) TeeStore'a veya içerik sağlayıcılarına aittir ve telif hakkı yasaları ile korunmaktadır. İzinsiz kullanımı yasaktır.
                    </p>

                    <h3>4. Kullanıcı Hesapları</h3>
                    <p>
                        Sitemizde bir hesap oluşturduğunuzda, sağladığınız bilgilerin doğru ve güncel olduğunu taahhüt edersiniz. Hesap güvenliğinizden siz sorumlusunuz.
                    </p>

                    <h3>5. Satış ve İade Koşulları</h3>
                    <p>
                        Ürün satın alımları, sitemizde belirtilen satış sözleşmesine tabidir. İade ve değişim politikalarımız hakkında detaylı bilgi için ilgili sayfayı ziyaret ediniz.
                    </p>

                    <h3>6. Değişiklikler</h3>
                    <p>
                        TeeStore, bu kullanım şartlarını dilediği zaman değiştirme hakkını saklı tutar. Değişiklikler sitede yayınlandığı andan itibaren geçerli olur.
                    </p>

                    <h3>7. İletişim</h3>
                    <p>
                        Kullanım şartları ile ilgili sorularınız için <a href="/contact" className="text-indigo-600 hover:text-indigo-500">iletişim sayfamızdan</a> bize ulaşabilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
}
