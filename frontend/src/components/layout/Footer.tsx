import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-primary-900/20 to-gray-900 text-gray-300 overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="gradient-text-neon">TeeStore</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              En kaliteli özel tasarım tişörtlerin buluşma noktası. Kendi tarzınızı yaratın veya binlerce benzersiz tasarım arasından seçim yapın.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 gradient-text">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-primary-400 transition-colors duration-300">
                  Tasarımları Keşfet
                </Link>
              </li>
              <li>
                <Link href="/influencer/design/create" className="text-sm hover:text-primary-400 transition-colors duration-300">
                  Kendi Tişörtünü Tasarla
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-sm hover:text-primary-400 transition-colors duration-300">
                  Tasarımcı Ol
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 gradient-text">Destek</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-accent-400 transition-colors duration-300">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-accent-400 transition-colors duration-300">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-accent-400 transition-colors duration-300">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-accent-400 transition-colors duration-300">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-accent-400 transition-colors duration-300">
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 gradient-text">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Teknoloji Vadisi, No: 123
                  <br />
                  İstanbul, Türkiye
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-sm">+90 (212) 123 45 67</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-sm">info@teestore.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TeeStore. Tüm hakları saklıdır.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" /> by TeeStore Team
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

