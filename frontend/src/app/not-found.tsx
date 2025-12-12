import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-black text-indigo-100">404</h1>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <h2 className="text-3xl font-bold text-gray-900">Sayfa Bulunamadı</h2>
                    </div>
                </div>

                <p className="text-gray-500 mb-8 text-lg">
                    Üzgünüz, aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Home className="mr-2 h-5 w-5" />
                        Ana Sayfa
                    </Link>

                    <Link
                        href="/designs"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm hover:shadow-md"
                    >
                        <Search className="mr-2 h-5 w-5" />
                        Tasarımları Keşfet
                    </Link>
                </div>
            </div>
        </div>
    )
}
