import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
    const faqs = [
        {
            question: "Siparişim ne zaman kargoya verilir?",
            answer: "Siparişleriniz genellikle 1-3 iş günü içerisinde hazırlanıp kargoya teslim edilmektedir. Özel tasarım ürünlerde bu süre 2-4 iş gününü bulabilir."
        },
        {
            question: "İade ve değişim koşulları nelerdir?",
            answer: "Satın aldığınız ürünleri, teslimat tarihinden itibaren 14 gün içinde iade edebilirsiniz. Ürünlerin kullanılmamış ve orijinal ambalajında olması gerekmektedir. Kişiye özel tasarımlarda iade kabul edilmemektedir."
        },
        {
            question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
            answer: "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeleriniz 256-bit SSL sertifikası ile korunmaktadır."
        },
        {
            question: "Kargo ücreti ne kadar?",
            answer: "500 TL ve üzeri alışverişlerinizde kargo ücretsizdir. Bu tutarın altındaki siparişlerde sabit kargo ücreti 29.90 TL'dir."
        },
        {
            question: "Kendi tasarımımı nasıl satabilirim?",
            answer: "Influencer veya tasarımcı olarak kayıt olduktan sonra 'Tasarım Yükle' panelinden tasarımlarınızı yükleyebilir, ürün tipi ve fiyatını belirleyerek satışa sunabilirsiniz."
        },
        {
            question: "Yurt dışına gönderim yapıyor musunuz?",
            answer: "Şu an için sadece Türkiye sınırları içerisine gönderim yapmaktayız. Yurt dışı gönderim seçenekleri üzerinde çalışmalarımız devam etmektedir."
        },
    ];

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center gap-3">
                        <HelpCircle className="h-8 w-8 text-indigo-600" />
                        Sıkça Sorulan Sorular
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Aklınıza takılan soruların cevaplarını burada bulabilirsiniz. Başka bir sorunuz varsa bizimle iletişime geçmekten çekinmeyin.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="flex flex-col">
                                <dt className="text-base font-semibold leading-7 text-gray-900 bg-gray-50 p-4 rounded-t-xl border-b border-gray-100">
                                    {faq.question}
                                </dt>
                                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 bg-white p-4 rounded-b-xl border border-t-0 border-gray-100 shadow-sm">
                                    <p className="flex-auto">{faq.answer}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
