"use client"

import { useAppSelector } from "@/shared/hooks/use-app-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShelfInteractionsChart } from "./shelf-interactions-chart"
import { TimeSeriesChart } from "./time-series-chart"

export function AnalyticsPanel() {
  const shelves = useAppSelector((state) => state.shelves.items)
  const shelfInteractions = useAppSelector((state) => state.analytics.shelfInteractions)
  const timeData = useAppSelector((state) => state.analytics.timeData)

  // Prepare data for the charts
  const interactionData = Object.entries(shelfInteractions).map(([shelfId, count]) => {
    const shelf = shelves.find((s) => s.id === shelfId)
    return {
      id: shelfId,
      label: shelf ? `${shelf.type} (${shelf.size})` : "Unknown",
      value: count,
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shelf Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ShelfInteractionsChart data={interactionData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interactions Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeSeriesChart data={timeData} shelves={shelves} />
        </CardContent>
      </Card>
    </div>
  )
}

