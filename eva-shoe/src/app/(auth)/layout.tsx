// src/app/(auth)/layout.tsx
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-9 h-9 text-black group-hover:scale-105 transition-transform" viewBox="0 0 40 40" fill="none">
                <path d="M8 28C8 28 10 22 14 20C18 18 26 18 30 14C32 12 34 8 34 8C34 8 33 18 29 23C25 28 18 29 14 29C10 29 8 28 8 28Z" fill="#18181B" />
                <path d="M30 14L34 32H31L28 20" fill="#18181B" />
                <circle cx="28" cy="14" r="3" fill="#C89B3C" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight font-serif text-black">
              EVA <span className="text-[#C89B3C]">SHOE</span>
            </span>
          </Link>
        </div>

        {/* Contenu */}
        {children}
      </div>
    </div>
  )
}