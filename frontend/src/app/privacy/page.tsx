import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0 mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center gap-3">
                        <Shield className="h-8 w-8 text-indigo-600" />
                        Gizlilik Politikası
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Son Güncelleme: 27 Kasım 2024
                    </p>
                </div>

                <div className="prose prose-indigo max-w-none text-gray-600">
                    <h3>1. Veri Toplama</h3>
                    <p>
                        TeeStore olarak, hizmetlerimizi sunabilmek için bazı kişisel verilerinizi (ad, soyad, e-posta, adres vb.) topluyoruz. Bu veriler, siparişlerinizi işlemek ve size daha iyi bir deneyim sunmak için kullanılır.
                    </p>

                    <h3>2. Verilerin Kullanımı</h3>
                    <p>
                        Topladığımız veriler, sipariş teslimatı, müşteri desteği, pazarlama iletişimi (izniniz dahilinde) ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılır.
                    </p>

                    <h3>3. Veri Güvenliği</h3>
                    <p>
                        Kişisel verilerinizin güvenliği bizim için önemlidir. Verilerinizi korumak için endüstri standardı güvenlik önlemleri (SSL şifreleme vb.) kullanıyoruz.
                    </p>

                    <h3>4. Çerezler (Cookies)</h3>
                    <p>
                        Web sitemizde kullanıcı deneyimini iyileştirmek ve site trafiğini analiz etmek için çerezler kullanıyoruz. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
                    </p>

                    <h3>5. Üçüncü Taraflarla Paylaşım</h3>
                    <p>
                        Verilerinizi, yasal zorunluluklar ve hizmet sağlayıcılarımız (kargo firmaları, ödeme sistemleri vb.) dışında üçüncü taraflarla paylaşmıyoruz.
                    </p>

                    <h3>6. Haklarınız</h3>
                    <p>
                        Kişisel verilerinize erişme, düzeltme, silme ve işlenmesini kısıtlama hakkına sahipsiniz. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
                    </p>

                    <h3>7. İletişim</h3>
                    <p>
                        Gizlilik politikamız ile ilgili sorularınız için <a href="/contact" className="text-indigo-600 hover:text-indigo-500">iletişim sayfamızdan</a> bize ulaşabilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
}
