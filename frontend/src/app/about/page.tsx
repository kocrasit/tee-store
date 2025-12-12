import React from 'react';
import { Users, Target, Heart, Award } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-indigo-900 py-24 sm:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
                        alt=""
                        className="h-full w-full object-cover object-center"
                    />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Hakkımızda</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            TeeStore, yaratıcılığı ve kaliteyi buluşturan, herkesin kendi tarzını yansıtabileceği bir platformdur.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-start">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Misyonumuz
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Amacımız, bağımsız tasarımcıları destekleyerek onların sanatlarını giyilebilir ürünlere dönüştürmelerine olanak sağlamak ve müşterilerimize benzersiz, kaliteli ürünler sunmaktır. Sürdürülebilir üretim yöntemlerini benimseyerek çevreye duyarlı bir moda anlayışını teşvik ediyoruz.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            <div className="flex flex-col gap-y-4 border-l-4 border-indigo-600 pl-6">
                                <dt className="text-base leading-7 text-gray-600">Kuruluş</dt>
                                <dd className="text-3xl font-bold tracking-tight text-gray-900">2023</dd>
                            </div>
                            <div className="flex flex-col gap-y-4 border-l-4 border-indigo-600 pl-6">
                                <dt className="text-base leading-7 text-gray-600">Tasarımcı</dt>
                                <dd className="text-3xl font-bold tracking-tight text-gray-900">500+</dd>
                            </div>
                            <div className="flex flex-col gap-y-4 border-l-4 border-indigo-600 pl-6">
                                <dt className="text-base leading-7 text-gray-600">Mutlu Müşteri</dt>
                                <dd className="text-3xl font-bold tracking-tight text-gray-900">10k+</dd>
                            </div>
                            <div className="flex flex-col gap-y-4 border-l-4 border-indigo-600 pl-6">
                                <dt className="text-base leading-7 text-gray-600">Ürün Çeşidi</dt>
                                <dd className="text-3xl font-bold tracking-tight text-gray-900">2000+</dd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 sm:pb-32">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Değerlerimiz</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        İşimizin merkezinde şeffaflık, kalite ve topluluk odaklılık yer alır.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                        <div className="flex flex-col">
                            <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                                <div className="rounded-lg bg-indigo-600 p-2">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                Topluluk Odaklı
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                <p className="flex-auto">Tasarımcılarımızı ve müşterilerimizi bir araya getiren güçlü bir topluluk oluşturuyoruz.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                                <div className="rounded-lg bg-indigo-600 p-2">
                                    <Target className="h-5 w-5 text-white" />
                                </div>
                                Kalite Standartları
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                <p className="flex-auto">En iyi kumaşları ve baskı teknolojilerini kullanarak uzun ömürlü ürünler sunuyoruz.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                                <div className="rounded-lg bg-indigo-600 p-2">
                                    <Heart className="h-5 w-5 text-white" />
                                </div>
                                Müşteri Memnuniyeti
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                <p className="flex-auto">Mutluluğunuz bizim için önceliktir. 7/24 destek ve kolay iade imkanı sunuyoruz.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                                <div className="rounded-lg bg-indigo-600 p-2">
                                    <Award className="h-5 w-5 text-white" />
                                </div>
                                Yenilikçilik
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                <p className="flex-auto">Sürekli gelişen moda trendlerini takip ediyor ve platformumuzu güncel tutuyoruz.</p>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
