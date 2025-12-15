import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Description */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter text-white">
                            ELEGANSIA
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            Modern minimalist estetikle tasarlanmış, premium giyim deneyimi. Sürdürülebilir moda ve özgün tasarımlar.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Keşfet</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/designs" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Koleksiyonlar
                                </Link>
                            </li>
                            <li>
                                <Link href="/design/create" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Tasarla
                                </Link>
                            </li>
                            <li>
                                <Link href="/influencer/register" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Tasarımcı Başvurusu
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Dergi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Kurumsal</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Hakkımızda
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    İletişim
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    SSS
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Kullanım Şartları
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">İletişim</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-300">
                                    Levent 199, Büyükdere Cad.<br />
                                    İstanbul, Türkiye
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                <span className="text-sm text-gray-300">+90 (212) 123 45 67</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                <span className="text-sm text-gray-300">hello@elegansia.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} Elegansia Inc. Tüm hakları saklıdır.
                    </p>
                    <p className="text-xs text-gray-600">
                        Designed with precision
                    </p>
                </div>
            </div>
        </footer>
    );
}

