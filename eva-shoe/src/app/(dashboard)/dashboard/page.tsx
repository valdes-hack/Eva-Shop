// src/app/(dashboard)/dashboard/page.tsx
import DashboardStats from '@/components/dashboard/dashboard-stats'
import DashboardCharts from '@/components/dashboard/dashboard-charts'
import RecentOrders from '@/components/dashboard/recent-orders'
import BestProducts from '@/components/dashboard/best-products'
import RecentActivity from '@/components/dashboard/recent-activity'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <DashboardStats />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts />
        <BestProducts />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <RecentActivity />
      </div>
    </div>
  )
}