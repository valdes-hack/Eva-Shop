// src/components/auth/login-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth.validations'
import { signIn } from '@/lib/services/auth.service'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const authData = await signIn(data)
      
      if (authData.user) {
        // Récupérer le profil utilisateur pour vérifier le rôle
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single()
        
        // Rediriger selon le rôle
        if (profile?.role === 'admin' || profile?.role === 'manager') {
          router.push('/dashboard')
        } else {
          router.push('/')
        }
        router.refresh()
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Erreur connexion:', error)
      
      if (error.message?.includes('Invalid credentials')) {
        setError('root', { 
          message: 'Email ou mot de passe incorrect' 
        })
      } else if (error.message?.includes('Email not confirmed')) {
        setError('root', { 
          message: 'Veuillez confirmer votre email avant de vous connecter' 
        })
      } else {
        setError('root', { 
          message: error.message || 'Une erreur est survenue lors de la connexion' 
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
          Se connecter
        </h1>
        <p className="text-gray-600">
          Accédez à votre compte EVA SHOE
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

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
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

        {/* Se souvenir de moi + Mot de passe oublié */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              {...register('remember')}
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>
          
          <Link 
            href="/forgot-password" 
            className="text-sm text-yellow-600 hover:text-yellow-700"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Bouton de connexion */}
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
              Connexion...
            </div>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      {/* Lien vers l'inscription */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Vous n'avez pas encore de compte ?{' '}
          <Link href="/register" className="font-semibold text-yellow-600 hover:text-yellow-700">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}