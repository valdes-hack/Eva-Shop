// src/lib/hooks/use-categories-filters.ts
import { useState, useCallback, useMemo, useEffect } from 'react'

export interface CategoriesFilters {
  search: string
  status: 'all' | 'active' | 'hidden'
  parent: 'all' | 'main' | 'sub'
  sort: string
  page: number
  limit: number
}

export interface SortOption {
  value: string
  label: string
  field: string
  direction: 'asc' | 'desc'
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'order-asc', label: 'Ordre (croissant)', field: 'display_order', direction: 'asc' },
  { value: 'order-desc', label: 'Ordre (décroissant)', field: 'display_order', direction: 'desc' },
  { value: 'name-asc', label: 'Nom A-Z', field: 'name', direction: 'asc' },
  { value: 'name-desc', label: 'Nom Z-A', field: 'name', direction: 'desc' },
  { value: 'created-desc', label: 'Plus récentes', field: 'created_at', direction: 'desc' },
  { value: 'created-asc', label: 'Plus anciennes', field: 'created_at', direction: 'asc' }
]

const DEFAULT_FILTERS: CategoriesFilters = {
  search: '',
  status: 'all',
  parent: 'all',
  sort: 'order-asc',
  page: 1,
  limit: 10
}

export function useCategoriesFilters() {
  const [filters, setFilters] = useState<CategoriesFilters>(DEFAULT_FILTERS)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce de la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(filters.search)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters.search])

  // Mise à jour de la recherche
  const updateSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }, [])

  // Mise à jour du statut
  const updateStatus = useCallback((status: 'all' | 'active' | 'hidden') => {
    setFilters(prev => ({ ...prev, status, page: 1 }))
  }, [])

  // Mise à jour du filtre parent
  const updateParent = useCallback((parent: 'all' | 'main' | 'sub') => {
    setFilters(prev => ({ ...prev, parent, page: 1 }))
  }, [])

  // Mise à jour du tri
  const updateSort = useCallback((sort: string) => {
    setFilters(prev => ({ ...prev, sort, page: 1 }))
  }, [])

  // Mise à jour de la page
  const updatePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  // Mise à jour de la limite par page
  const updateLimit = useCallback((limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }))
  }, [])

  // Réinitialisation des filtres
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setDebouncedSearch('')
  }, [])

  // Conversion des filtres pour l'API Supabase
  const apiFilters = useMemo(() => {
    const sortOption = SORT_OPTIONS.find(opt => opt.value === filters.sort) || SORT_OPTIONS[0]
    
    return {
      search: debouncedSearch || undefined,
      is_active: filters.status === 'all' ? undefined : filters.status === 'active',
      parentOnly: filters.parent === 'main' ? true : undefined,
      parent_id: filters.parent === 'sub' ? 'not_null' : undefined,
      sort_field: sortOption.field,
      sort_direction: sortOption.direction,
      page: filters.page,
      limit: filters.limit
    }
  }, [filters, debouncedSearch])

  // Indicateurs d'état des filtres
  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' || 
           filters.status !== 'all' || 
           filters.parent !== 'all' ||
           filters.sort !== 'order-asc'
  }, [filters])

  const filterCount = useMemo(() => {
    let count = 0
    if (filters.search !== '') count++
    if (filters.status !== 'all') count++
    if (filters.parent !== 'all') count++
    if (filters.sort !== 'order-asc') count++
    return count
  }, [filters])

  return {
    // État des filtres
    filters,
    debouncedSearch,
    apiFilters,
    
    // Actions
    updateSearch,
    updateStatus,
    updateParent,
    updateSort,
    updatePage,
    updateLimit,
    resetFilters,
    
    // Métadonnées
    hasActiveFilters,
    filterCount,
    sortOptions: SORT_OPTIONS,
    defaultFilters: DEFAULT_FILTERS
  }
}