// src/app/(public)/profil/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUserProfileServer } from '@/lib/services/user-server.service'
import ProfileContent from '@/components/profil/profile-content'

export default async function ProfilPage() {
  // Récupérer l'utilisateur et le profil
  const result = await getCurrentUserProfileServer()
  
  if (!result) {
    redirect('/login')
  }

  const { user, profile } = result

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Mon Profil</h1>
        
        <ProfileContent 
          user={user} 
          profile={profile} 
        />
      </div>
    </div>
  )
}