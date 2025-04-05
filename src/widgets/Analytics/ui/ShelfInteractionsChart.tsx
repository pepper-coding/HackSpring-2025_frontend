"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ShelfInteractionsChartProps {
  data: {
    id: string;
    label: string;
    value: number;
  }[];
}

// Color palette for visualization
const colors = [
  "#4299e1", // blue
  "#38b2ac", // teal
  "#ed8936", // orange
  "#9f7aea", // purple
  "#48bb78", // green
];

export function ShelfInteractionsChart({ data }: ShelfInteractionsChartProps) {
  // Sort data by value in descending order and take top 10
  const sortedData = useMemo(
    () => data.sort((a, b) => b.value - a.value).slice(0, 10),
    [data]
  );

  const chartData = useMemo(
    () => ({
      labels: sortedData.map((item) => item.label),
      datasets: [
        {
          label: "Interactions",
          data: sortedData.map((item) => item.value),
          backgroundColor: "#4299e1", // Use a single color for consistency
          borderColor: "#2b6cb0",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    }),
    [sortedData]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x' as const, // Vertical bar chart
    plugins: {
      legend: {
        display: false, // Hide legend since we have only one dataset
      },
      title: {
        display: true,
        text: "Shelf Interactions",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.formattedValue} interactions`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Interactions'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Shelves'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="h-96">
      {data.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No interaction data available</p>
        </div>
      )}
    </div>
  );
}
