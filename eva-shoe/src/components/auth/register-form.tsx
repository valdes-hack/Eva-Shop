// src/components/auth/register-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth.validations'
import { signUp } from '@/lib/services/auth.service'

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      await signUp(data)
      
      // Redirection vers la page de vérification email
      router.push('/verify-email?email=' + encodeURIComponent(data.email))
    } catch (error: any) {
      console.error('Erreur inscription:', error)
      
      if (error.message?.includes('already registered')) {
        setError('email', { 
          message: 'Cette adresse email est déjà utilisée' 
        })
      } else {
        setError('root', { 
          message: error.message || 'Une erreur est survenue lors de l\'inscription' 
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Créer un compte
        </h1>
        <p className="text-gray-600">
          Rejoignez EVA SHOE et découvrez nos collections
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Erreur générale */}
        {errors.root && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.root.message}
          </div>
        )}

        {/* Prénom et Nom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              {...register('first_name')}
              type="text"
              id="first_name"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.first_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre prénom"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              {...register('last_name')}
              type="text"
              id="last_name"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.last_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre nom"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email *
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

        {/* Téléphone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+237 6XX XXX XXX"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe *
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={`w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirmation mot de passe */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe *
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className={`w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>



        {/* Bouton d'inscription */}
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
              Création du compte...
            </div>
          ) : (
            'Créer mon compte'
          )}
        </button>
      </form>

      {/* Lien vers la connexion */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-semibold text-yellow-600 hover:text-yellow-700">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}