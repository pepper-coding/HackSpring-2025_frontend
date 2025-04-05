"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { Shelf } from "@/entities/Shelves";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TimeSeriesChartProps {
  data: {
    labels: string[];
    datasets: {
      shelfId: string;
      data: number[];
    }[];
  };
  shelves: Shelf[];
}

// Colors for different shelf types
const shelfTypeColors: Record<string, string> = {
  dairy: "#4299e1", // blue
  bakery: "#38b2ac", // teal  
  produce: "#ed8936", // orange
  meat: "#f56565", // red
  general: "#9f7aea", // purple
};

// Fallback color
const defaultColor = "#48bb78"; // green

export function TimeSeriesChart({ data, shelves }: TimeSeriesChartProps) {
  // Group data by shelf type
  const groupedByType = useMemo(() => {
    // Create a map to store aggregated data by shelf type
    const typeMap: Record<string, number[]> = {};
    
    // Initialize all types with zero arrays
    const uniqueTypes = Array.from(new Set(shelves.map(shelf => shelf.type || "unknown")));
    uniqueTypes.forEach(type => {
      typeMap[type] = Array(data.labels.length).fill(0);
    });
    
    // Aggregate data by shelf type
    data.datasets.forEach(dataset => {
      const shelf = shelves.find(s => s.id === dataset.shelfId);
      const type = shelf?.type || "unknown";
      
      dataset.data.forEach((value, index) => {
        typeMap[type][index] = (typeMap[type][index] || 0) + value;
      });
    });
    
    // Convert to Chart.js dataset format
    return Object.entries(typeMap).map(([type, values]) => ({
      label: type,
      data: values,
      borderColor: shelfTypeColors[type] || defaultColor,
      backgroundColor: `${shelfTypeColors[type] || defaultColor}40`,
      tension: 0.3,
      borderWidth: 2,
    }));
  }, [data, shelves]);

  const chartData = {
    labels: data.labels,
    datasets: groupedByType,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          font: {
            weight: 'bold' as const,
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Hourly Interactions by Shelf Type",
        font: {
          size: 16,
        }
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any[]) => {
            return `Hour: ${tooltipItems[0].label}`;
          },
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw} interactions`;
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
        },
        stacked: false,
      },
      x: {
        title: {
          display: true,
          text: 'Hour of Day'
        }
      }
    },
  };

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
  );
}
