// src/lib/validations/auth.validations.ts
import { z } from 'zod'

// Schéma d'inscription
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  confirmPassword: z
    .string()
    .min(1, 'La confirmation du mot de passe est requise'),
  first_name: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  last_name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+237|237)?[0-9]{9}$/.test(val),
      'Format de téléphone invalide (ex: +237123456789)'
    ),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }
)

// Schéma de connexion
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
  remember: z.boolean().optional(),
})

// Schéma mot de passe oublié
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
})

// Schéma réinitialisation mot de passe
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  confirmPassword: z
    .string()
    .min(1, 'La confirmation du mot de passe est requise'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }
)

// Schéma profil utilisateur
export const profileSchema = z.object({
  first_name: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  last_name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  phone: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || /^(\+237|237)?[0-9]{9}$/.test(val),
      'Format de téléphone invalide (ex: +237123456789)'
    ),
  birth_date: z
    .string()
    .nullable()
    .optional(),
  gender: z
    .enum(['homme', 'femme', 'autre'])
    .nullable()
    .optional(),
  newsletter: z.boolean().default(false),
})

// Schéma adresse
export const addressSchema = z.object({
  type: z.enum(['domicile', 'bureau', 'autre']).default('domicile'),
  first_name: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  last_name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  phone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .refine(
      (val) => /^(\+237|237)?[0-9]{9}$/.test(val),
      'Format de téléphone invalide (ex: +237123456789)'
    ),
  address_line_1: z
    .string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .max(100, 'L\'adresse ne peut pas dépasser 100 caractères'),
  address_line_2: z
    .string()
    .max(100, 'Le complément d\'adresse ne peut pas dépasser 100 caractères')
    .optional(),
  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(50, 'La ville ne peut pas dépasser 50 caractères'),
  postal_code: z
    .string()
    .max(10, 'Le code postal ne peut pas dépasser 10 caractères')
    .optional(),
  country: z
    .string()
    .min(2, 'Le pays est requis')
    .default('Cameroun'),
  is_default: z.boolean().default(false),
})

// Types exportés
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type AddressFormData = z.infer<typeof addressSchema>