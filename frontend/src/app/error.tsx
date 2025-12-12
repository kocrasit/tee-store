'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Bir şeyler yanlış gitti!</h2>
                <p className="text-gray-500 mb-8">
                    Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
                </p>
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <RefreshCcw className="mr-2 h-5 w-5" />
                    Tekrar Dene
                </button>
            </div>
        </div>
    )
}
