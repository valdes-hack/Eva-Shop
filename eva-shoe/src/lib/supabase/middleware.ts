// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Récupérer l'utilisateur
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Routes protégées (dashboard admin)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      // Rediriger vers la connexion si pas connecté
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Vérifier le rôle pour les routes admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'manager'].includes(profile.role)) {
      // Rediriger vers l'accueil si pas les droits
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirection après connexion
  if (request.nextUrl.pathname.startsWith('/login') && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/'
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = redirectTo
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}