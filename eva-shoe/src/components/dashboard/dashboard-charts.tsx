// src/components/dashboard/dashboard-charts.tsx
'use client'

import { useState } from 'react'

export default function DashboardCharts() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  
  // Mock data for the chart
  const chartData = {
    '7d': [
      { day: 'Lun', orders: 25, revenue: 3500 },
      { day: 'Mar', orders: 32, revenue: 4200 },
      { day: 'Mer', orders: 18, revenue: 2800 },
      { day: 'Jeu', orders: 45, revenue: 6200 },
      { day: 'Ven', orders: 52, revenue: 7800 },
      { day: 'Sam', orders: 38, revenue: 5400 },
      { day: 'Dim', orders: 28, revenue: 3900 }
    ],
    '30d': [
      { day: 'Sem 1', orders: 180, revenue: 25000 },
      { day: 'Sem 2', orders: 220, revenue: 31000 },
      { day: 'Sem 3', orders: 195, revenue: 28000 },
      { day: 'Sem 4', orders: 255, revenue: 35000 }
    ]
  }

  const data = chartData[selectedPeriod as keyof typeof chartData]
  const maxRevenue = Math.max(...data.map(d => d.revenue))
  const maxOrders = Math.max(...data.map(d => d.orders))

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Évolution des ventes</h3>
          <p className="text-sm text-gray-500">Commandes et chiffre d'affaires</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod('7d')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedPeriod === '7d' 
                ? 'bg-[#C89B3C] text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            7 jours
          </button>
          <button
            onClick={() => setSelectedPeriod('30d')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedPeriod === '30d' 
                ? 'bg-[#C89B3C] text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            30 jours
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-4">
          <span>{(maxRevenue / 1000).toFixed(0)}k</span>
          <span>{(maxRevenue * 0.75 / 1000).toFixed(0)}k</span>
          <span>{(maxRevenue * 0.5 / 1000).toFixed(0)}k</span>
          <span>{(maxRevenue * 0.25 / 1000).toFixed(0)}k</span>
          <span>0</span>
        </div>

        {/* Chart */}
        <div className="ml-12 h-full flex items-end gap-4 border-l border-b border-gray-200">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {/* Revenue bar */}
              <div className="relative w-full flex justify-center">
                <div
                  className="bg-[#C89B3C] rounded-t-sm min-h-[4px] transition-all duration-500 ease-out"
                  style={{
                    height: `${(item.revenue / maxRevenue) * 100}%`,
                    width: '24px'
                  }}
                  title={`Revenus: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(item.revenue)}`}
                />
              </div>
              
              {/* Orders indicator */}
              <div className="relative">
                <div 
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  title={`Commandes: ${item.orders}`}
                />
              </div>
              
              {/* Day label */}
              <span className="text-xs text-gray-600 font-medium">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#C89B3C] rounded-sm"></div>
          <span className="text-sm text-gray-600">Revenus (FCFA)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Commandes</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data.reduce((sum, item) => sum + item.orders, 0)}
          </div>
          <div className="text-sm text-gray-500">Commandes totales</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XAF',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(data.reduce((sum, item) => sum + item.revenue, 0))}
          </div>
          <div className="text-sm text-gray-500">Revenus totaux</div>
        </div>
      </div>
    </div>
  )
}