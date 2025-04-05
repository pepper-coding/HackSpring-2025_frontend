"use client"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ShelfInteractionsChartProps {
  data: {
    id: string
    label: string
    value: number
  }[]
}

export function ShelfInteractionsChart({ data }: ShelfInteractionsChartProps) {
  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  const chartData = {
    labels: sortedData.map((item) => item.label),
    datasets: [
      {
        label: "Interactions",
        data: sortedData.map((item) => item.value),
        backgroundColor: [
          "#a8e6cf", // dairy
          "#dcedc1", // bakery
          "#ffd3b6", // produce
          "#ffaaa5", // meat
          "#b8b8ff", // vegetables
        ],
        borderColor: ["#88d6bf", "#ccdd91", "#efc396", "#ef9a95", "#a8a8ef"],
        borderWidth: 1,
      },
    ],
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
        text: "Shelf Interactions",
      },
    },
  }

  return (
    <div className="h-80">
      {data.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No interaction data available</p>
        </div>
      )}
    </div>
  )
}

