// src/lib/types/auth.types.ts

export interface UserProfile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  role: 'client' | 'admin' | 'manager'
  preferences: Record<string, any>
  created_at: string
  updated_at: string | null
}

export interface Address {
  id: string
  user_id: string
  address_line: string
  city: string
  postal_code: string | null
  country: string
  is_default: boolean
  type: 'shipping' | 'billing' | 'both'
  created_at: string
  updated_at: string | null
}