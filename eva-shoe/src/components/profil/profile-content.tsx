// src/components/profil/profile-content.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateUserProfile } from '@/lib/services/user.service'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/lib/types/auth.types'

const profileSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileContentProps {
  user: User
  profile: UserProfile | null
}

export default function ProfileContent({ user, profile }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)

    try {
      await updateUserProfile(data)
      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      console.error('Erreur mise à jour profil:', error)
      setError('root', { 
        message: error.message || 'Une erreur est survenue' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Informations principales */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-[#C89B3C] hover:text-[#b08732] font-medium"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Erreur générale */}
              {errors.root && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errors.root.message}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    {...register('first_name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    {...register('last_name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                  placeholder="+237 6XX XXX XXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#C89B3C] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#b08732] disabled:opacity-50"
                >
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Prénom</label>
                  <p className="text-gray-900">{profile?.first_name || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nom</label>
                  <p className="text-gray-900">{profile?.last_name || 'Non renseigné'}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                <p className="text-gray-900">{profile?.phone || 'Non renseigné'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Rôle</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {profile?.role === 'client' ? 'Client' : profile?.role}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Membre depuis</label>
                <p className="text-gray-900">
                  {new Date(profile?.created_at || user.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Mes statistiques</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Commandes</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Favoris</span>
              <span className="font-bold">0</span>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Mes commandes
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Mes favoris
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Mes adresses
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}