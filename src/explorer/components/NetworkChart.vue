<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      fill: boolean
      borderColor: string
      backgroundColor: string
      tension: number
    }>
  }
  title: string
  period?: string
}>()

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1E2933',
      bodyColor: '#516273',
      borderColor: '#1E2933',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        weight: 'bold',
        family: 'Montserrat'
      },
      bodyFont: {
        size: 13,
        family: 'Inter'
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(81, 98, 115, 0.1)'
      },
      ticks: {
        font: {
          size: 12,
          family: 'Inter'
        },
        color: '#516273'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 12,
          family: 'Inter'
        },
        color: '#516273'
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
}
</script>

<template>
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-medium text-secondary font-display">{{ title }}</h2>
      <span class="text-xs bg-secondary/5 px-3 py-1 rounded-full text-neutral">
        {{ period || 'Last 6 Hours' }}
      </span>
    </div>
    <div class="h-64">
      <Line :data="data" :options="chartOptions" />
    </div>
  </div>
</template> 