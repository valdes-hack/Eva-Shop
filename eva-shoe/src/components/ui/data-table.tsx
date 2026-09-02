// src/components/ui/data-table.tsx
'use client'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  selectedItems?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void
  sortField?: keyof T
  sortDirection?: 'asc' | 'desc'
  emptyMessage?: string
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading = false,
  selectedItems = [],
  onSelectionChange,
  onSort,
  sortField,
  sortDirection,
  emptyMessage = 'Aucune donnée disponible'
}: DataTableProps<T>) {
  const handleSelectAll = () => {
    if (!onSelectionChange) return
    
    if (selectedItems.length === data.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(data.map(item => item.id))
    }
  }

  const handleSelectItem = (id: string) => {
    if (!onSelectionChange) return
    
    if (selectedItems.includes(id)) {
      onSelectionChange(selectedItems.filter(itemId => itemId !== id))
    } else {
      onSelectionChange([...selectedItems, id])
    }
  }

  const handleSort = (key: keyof T) => {
    if (!onSort) return
    
    const newDirection = sortField === key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(key, newDirection)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {onSelectionChange && (
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]"
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th key={String(column.key)} className="px-6 py-3 text-left">
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      {column.label}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {onSelectionChange && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]"
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 text-sm text-gray-900">
                      {column.render 
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '-')
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}