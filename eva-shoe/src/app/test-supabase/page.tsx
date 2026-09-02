// src/app/test-supabase/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function TestSupabasePage() {
  const supabase = await createClient()
  
  // Test de connexion
  const { data, error } = await supabase.from('profiles').select('*').limit(1)
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Connexion Supabase</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Résultat :</h2>
        {error ? (
          <div className="text-red-600">
            <p>❌ Erreur : {error.message}</p>
            <p className="text-sm mt-2">Note : C'est normal si la table 'profiles' n'existe pas encore</p>
          </div>
        ) : (
          <div className="text-green-600">
            <p>✅ Connexion réussie !</p>
            <pre className="mt-2 text-xs">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <a href="/" className="text-blue-600 hover:underline">← Retour à l'accueil</a>
      </div>
    </div>
  )
}
