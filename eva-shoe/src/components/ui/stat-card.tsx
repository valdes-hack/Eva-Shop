// src/components/ui/stat-card.tsx
'use client'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  bgColor?: string
  isLoading?: boolean
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon, 
  bgColor = 'bg-blue-500',
  isLoading = false 
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 ${bgColor} rounded-lg`}></div>
        </div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        
        {change !== undefined && (
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            {changeLabel && (
              <span className="text-xs text-gray-500">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}