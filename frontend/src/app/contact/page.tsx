'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">İletişime Geçin</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Sorularınız, önerileriniz veya işbirlikleri için bize ulaşın. Ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-20 lg:max-w-none lg:grid-cols-3">
                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-8">
                        <div className="rounded-2xl bg-gray-50 p-10">
                            <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                                <Mail className="h-5 w-5 text-indigo-600" />
                                E-posta
                            </h3>
                            <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                                <div>
                                    <dt className="sr-only">Email</dt>
                                    <dd><a className="font-semibold text-indigo-600 hover:text-indigo-500" href="mailto:info@teestore.com">info@teestore.com</a></dd>
                                </div>
                                <div className="mt-1">Destek ekibimiz 24 saat içinde yanıt verir.</div>
                            </dl>
                        </div>
                        <div className="rounded-2xl bg-gray-50 p-10">
                            <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                                <Phone className="h-5 w-5 text-indigo-600" />
                                Telefon
                            </h3>
                            <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                                <div>
                                    <dt className="sr-only">Phone</dt>
                                    <dd><a className="font-semibold text-indigo-600 hover:text-indigo-500" href="tel:+902121234567">+90 (212) 123 45 67</a></dd>
                                </div>
                                <div className="mt-1">Hafta içi 09:00 - 18:00 arası.</div>
                            </dl>
                        </div>
                        <div className="rounded-2xl bg-gray-50 p-10">
                            <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-indigo-600" />
                                Ofis
                            </h3>
                            <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                                <div>
                                    <dt className="sr-only">Address</dt>
                                    <dd>Teknoloji Vadisi, No: 123<br />İstanbul, Türkiye</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5 p-8 sm:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">Adınız</label>
                                    <div className="mt-2.5">
                                        <input type="text" name="first-name" id="first-name" autoComplete="given-name" required className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">Soyadınız</label>
                                    <div className="mt-2.5">
                                        <input type="text" name="last-name" id="last-name" autoComplete="family-name" required className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">E-posta Adresi</label>
                                    <div className="mt-2.5">
                                        <input type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="subject" className="block text-sm font-semibold leading-6 text-gray-900">Konu</label>
                                    <div className="mt-2.5">
                                        <input type="text" name="subject" id="subject" required className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Mesajınız</label>
                                    <div className="mt-2.5">
                                        <textarea name="message" id="message" rows={4} required className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    Mesajı Gönder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
