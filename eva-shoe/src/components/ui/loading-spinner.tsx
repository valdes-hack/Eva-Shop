// src/components/ui/loading-spinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10', 
    lg: 'w-16 h-16'
  }

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-[#C89B3C]`}></div>
    </div>
  )
}