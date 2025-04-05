"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import type { Shelf } from "@/entities/shelves/model/shelves-slice"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface TimeSeriesChartProps {
  data: {
    labels: string[]
    datasets: {
      shelfId: string
      data: number[]
    }[]
  }
  shelves: Shelf[]
}

// Color mappings for different shelf types
const shelfColors: Record<string, string> = {
  dairy: "#a8e6cf",
  bakery: "#dcedc1",
  produce: "#ffd3b6",
  meat: "#ffaaa5",
  vegetables: "#b8b8ff",
}

export function TimeSeriesChart({ data, shelves }: TimeSeriesChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => {
      const shelf = shelves.find((s) => s.id === dataset.shelfId)
      const shelfType = shelf?.type || "vegetables"
      const color = shelfColors[shelfType] || "#b8b8ff"

      return {
        label: shelf ? `${shelf.type} (${shelf.size})` : "Unknown",
        data: dataset.data,
        borderColor: color,
        backgroundColor: `${color}80`, // Add transparency
        tension: 0.3,
      }
    }),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Interactions by Hour",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="h-80">
      {data.datasets.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No time series data available</p>
        </div>
      )}
    </div>
  )
}

