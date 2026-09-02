// src/app/(auth)/verify-email/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border">
      <div className="text-center">
        {/* Icône email */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
          <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Vérifiez votre email
        </h1>
        
        <div className="text-gray-600 mb-6 space-y-2">
          <p>
            Nous avons envoyé un lien de confirmation à :
          </p>
          <p className="font-medium text-gray-900">
            {email || 'votre adresse email'}
          </p>
          <p>
            Cliquez sur le lien dans l'email pour activer votre compte.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="flex-shrink-0 w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong>Pas d'email reçu ?</strong> Vérifiez vos spams ou 
                <button className="underline hover:no-underline ml-1">
                  renvoyer l'email
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Retour à la connexion
          </Link>
          
          <Link
            href="/"
            className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <div className="animate-pulse text-center">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}