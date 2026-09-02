// src/app/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { forgotPassword } from '@/lib/services/auth.service'

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)

    try {
      await forgotPassword(data.email)
      setIsSuccess(true)
    } catch (error: any) {
      console.error('Erreur mot de passe oublié:', error)
      setError('root', { 
        message: error.message || 'Une erreur est survenue' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <div className="text-center">
          {/* Icône succès */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Email envoyé !
          </h1>
          
          <div className="text-gray-600 mb-6 space-y-2">
            <p>
              Nous avons envoyé un lien de récupération à :
            </p>
            <p className="font-medium text-gray-900">
              {getValues('email')}
            </p>
            <p>
              Vérifiez vos emails et suivez les instructions pour réinitialiser votre mot de passe.
            </p>
          </div>

          <Link
            href="/login"
            className="w-full inline-block py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mot de passe oublié
        </h1>
        <p className="text-gray-600">
          Entrez votre email pour recevoir un lien de récupération
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Erreur générale */}
        {errors.root && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.root.message}
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="votre.email@exemple.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Bouton d'envoi */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </div>
          ) : (
            'Envoyer le lien de récupération'
          )}
        </button>
      </form>

      {/* Liens */}
      <div className="mt-8 text-center space-y-2">
        <p className="text-gray-600">
          Vous vous souvenez de votre mot de passe ?{' '}
          <Link href="/login" className="font-semibold text-yellow-600 hover:text-yellow-700">
            Se connecter
          </Link>
        </p>
        <p className="text-gray-600">
          Pas encore de compte ?{' '}
          <Link href="/register" className="font-semibold text-yellow-600 hover:text-yellow-700">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}