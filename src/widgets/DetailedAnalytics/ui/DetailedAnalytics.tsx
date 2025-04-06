"use client";

import { useAppSelector } from "@/shared/hooks/useAppSelector";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ShelfInteractionsChart } from "@/widgets/Analytics/ui/ShelfInteractionsChart";
import { TimeSeriesChart } from "@/widgets/Analytics/ui/TimeSeriesChart";
import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Button } from "@/shared/components/ui/button";
import { Download, Calendar, Filter, BarChart2, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar as CalendarComponent } from "@/shared/components/ui/calendar";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import * as XLSX from "xlsx";

interface ShelfInteractionData {
  id: string;
  name: string;
  value: number;
  type: string;
  size: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const shelfColors: Record<string, string> = {
  dairy: "#a8e6cf",
  bakery: "#dcedc1",
  produce: "#ffd3b6",
  meat: "#ffaaa5",
};

const chartColors = Object.values(shelfColors);

export function DetailedAnalytics() {
  const shelves = useAppSelector((state) => state.shelves.items);
  const shelfInteractions = useAppSelector(
    (state) => state.analytics.shelfInteractions
  );
  const timeData = useAppSelector((state) => state.analytics.timeData);

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [compareMode, setCompareMode] = useState(false);
  const [compareStartDate, setCompareStartDate] = useState<Date | undefined>(
    new Date()
  );
  const [compareEndDate, setCompareEndDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedShelfTypes, setSelectedShelfTypes] = useState<string[]>([]);
  const [selectedShelfSizes, setSelectedShelfSizes] = useState<string[]>([]);

  const interactionData = useMemo<ShelfInteractionData[]>(() => {
    return Object.entries(shelfInteractions).map(([shelfId, count]) => {
      const shelf = shelves.find((s) => s.id === shelfId);
      return {
        id: shelfId,
        name: shelf ? `${shelf.type} (${shelf.size})` : "Unknown",
        value: count,
        type: shelf?.type || "unknown",
        size: shelf?.size || "unknown",
      };
    });
  }, [shelfInteractions, shelves]);

  const shelfTypes = useMemo(
    () => Array.from(new Set(shelves.map((shelf) => shelf.type))),
    [shelves]
  );

  const shelfSizes = useMemo(
    () => Array.from(new Set(shelves.map((shelf) => shelf.size))),
    [shelves]
  );

  const filteredData = useMemo(() => {
    return interactionData.filter((item) => {
      const typeMatch =
        selectedShelfTypes.length === 0 ||
        selectedShelfTypes.includes(item.type);
      const sizeMatch =
        selectedShelfSizes.length === 0 ||
        selectedShelfSizes.includes(item.size);
      return typeMatch && sizeMatch;
    });
  }, [interactionData, selectedShelfTypes, selectedShelfSizes]);

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const interactionDataArray = [
      ["Shelf ID", "Shelf Type", "Shelf Size", "Interactions"],
      ...interactionData.map((item) => [
        item.id,
        item.type,
        item.size,
        item.value,
      ]),
    ];
    const wsInteractions = XLSX.utils.aoa_to_sheet(interactionDataArray);
    XLSX.utils.book_append_sheet(wb, wsInteractions, "Shelf Interactions");

    const hourlyData = [
      [
        "Hour",
        ...timeData.datasets.map((ds) => {
          const shelf = shelves.find((s) => s.id === ds.shelfId);
          return shelf ? `${shelf.type} (${shelf.size})` : ds.shelfId;
        }),
      ],
      ...timeData.labels.map((hour, idx) => [
        hour,
        ...timeData.datasets.map((ds) => ds.data[idx]),
      ]),
    ];
    const wsHourly = XLSX.utils.aoa_to_sheet(hourlyData);
    XLSX.utils.book_append_sheet(wb, wsHourly, "Hourly Data");

    XLSX.writeFile(wb, "store_analytics.xlsx");
  };

  const toggleTypeFilter = (type: string) => {
    setSelectedShelfTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleSizeFilter = (size: string) => {
    setSelectedShelfSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const interactionsByType = useMemo(() => {
    const typeMap: Record<string, number> = {};
    interactionData.forEach((item) => {
      if (!typeMap[item.type]) {
        typeMap[item.type] = 0;
      }
      typeMap[item.type] += item.value;
    });
    return Object.entries(typeMap).map(([type, count]) => ({
      name: type,
      value: count,
    }));
  }, [interactionData]);

  const pieChartDataByType = useMemo(() => {
    return {
      labels: interactionsByType.map((item) => item.name),
      datasets: [
        {
          data: interactionsByType.map((item) => item.value),
          backgroundColor: interactionsByType.map(
            (item) => shelfColors[item.name] || "#b8b8ff"
          ),
        },
      ],
    };
  }, [interactionsByType]);

  const interactionsBySize = useMemo(() => {
    const sizeMap: Record<string, number> = {};
    interactionData.forEach((item) => {
      if (!sizeMap[item.size]) {
        sizeMap[item.size] = 0;
      }
      sizeMap[item.size] += item.value;
    });
    return Object.entries(sizeMap).map(([size, count]) => ({
      name: size,
      value: count,
    }));
  }, [interactionData]);

  const barChartDataBySize = useMemo(() => {
    return {
      labels: interactionsBySize.map((item) => item.name),
      datasets: [
        {
          label: "Interactions",
          data: interactionsBySize.map((item) => item.value),
          backgroundColor: chartColors,
        },
      ],
    };
  }, [interactionsBySize]);

  const verticalBarData = useMemo(() => {
    const sortedData = [...interactionData].sort((a, b) => b.value - a.value);
    return {
      labels: sortedData.map((item) => item.name),
      datasets: [
        {
          label: "Interactions",
          data: sortedData.map((item) => item.value),
          backgroundColor: sortedData.map(
            (item) => shelfColors[item.type] || "#b8b8ff"
          ),
        },
      ],
    };
  }, [interactionData]);

  const hourlyTotalData = useMemo(() => {
    const hourData = Array(24).fill(0);

    timeData.datasets.forEach((dataset) => {
      dataset.data.forEach((count, hourIndex) => {
        hourData[hourIndex] += count;
      });
    });

    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: "Interactions",
          data: hourData,
          borderColor: "#8884d8",
          backgroundColor: "rgba(136, 132, 216, 0.2)",
        },
      ],
    };
  }, [timeData]);

  const stats = useMemo(() => {
    if (interactionData.length === 0)
      return { total: 0, max: 0, avg: 0, min: 0 };

    const total = interactionData.reduce((sum, item) => sum + item.value, 0);
    const values = interactionData.map((item) => item.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = total / interactionData.length;

    return { total, max, avg: Math.round(avg * 100) / 100, min };
  }, [interactionData]);

  const peakHours = useMemo(() => {
    if (hourlyTotalData.datasets[0].data.length === 0) return [];

    const hoursWithData = hourlyTotalData.labels.map((hour, index) => ({
      hour,
      interactions: hourlyTotalData.datasets[0].data[index],
    }));

    const sortedHours = [...hoursWithData].sort(
      (a, b) => b.interactions - a.interactions
    );
    return sortedHours.slice(0, 3).map((hour) => ({
      hour: hour.hour,
      interactions: hour.interactions,
    }));
  }, [hourlyTotalData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full space-y-6">
      {/* Analytics Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between border-b pb-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {/* Date Range Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 flex items-center gap-1 hover:bg-blue-50 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                {startDate && endDate ? (
                  <span>
                    {format(startDate, "MMM d")} -{" "}
                    {format(endDate, "MMM d, yyyy")}
                  </span>
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <div className="space-y-3">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Date Range</div>
                    <div className="flex items-center gap-2">
                      <Select
                        onValueChange={(value) => {
                          const today = new Date();
                          if (value === "today") {
                            setStartDate(today);
                            setEndDate(today);
                          } else if (value === "week") {
                            const weekStart = new Date(today);
                            weekStart.setDate(weekStart.getDate() - 7);
                            setStartDate(weekStart);
                            setEndDate(today);
                          } else if (value === "month") {
                            const monthStart = new Date(today);
                            monthStart.setMonth(monthStart.getMonth() - 1);
                            setStartDate(monthStart);
                            setEndDate(today);
                          }
                        }}
                      >
                        <SelectTrigger className="h-8 w-[120px]">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">Last Week</SelectItem>
                          <SelectItem value="month">Last Month</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Start - End Date
                      </div>
                      <CalendarComponent
                        mode="range"
                        selected={{
                          from: startDate!,
                          to: endDate!,
                        }}
                        onSelect={(range) => {
                          setStartDate(range?.from);
                          setEndDate(range?.to);
                        }}
                        numberOfMonths={2}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="compare-mode"
                    checked={compareMode}
                    onCheckedChange={setCompareMode}
                  />
                  <Label htmlFor="compare-mode">
                    Compare with previous period
                  </Label>
                </div>
                {compareMode && (
                  <div className="border-t pt-3">
                    <div className="text-sm font-medium mb-2">
                      Comparison Period
                    </div>
                    <CalendarComponent
                      mode="range"
                      selected={{
                        from: compareStartDate!,
                        to: compareEndDate!,
                      }}
                      onSelect={(range) => {
                        setCompareStartDate(range?.from);
                        setCompareEndDate(range?.to);
                      }}
                      numberOfMonths={2}
                    />
                  </div>
                )}
                <Button className="w-full" size="sm">
                  Apply Date Range
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 flex items-center gap-1 hover:bg-blue-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(selectedShelfTypes.length > 0 ||
                  selectedShelfSizes.length > 0) && (
                  <Badge
                    variant="secondary"
                    className="ml-1 rounded-full px-1 text-xs"
                  >
                    {selectedShelfTypes.length + selectedShelfSizes.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Shelf Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {shelfTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Switch
                          id={`type-${type}`}
                          checked={selectedShelfTypes.includes(type)}
                          onCheckedChange={() => toggleTypeFilter(type)}
                        />
                        <Label htmlFor={`type-${type}`} className="capitalize">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Shelf Size</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {shelfSizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Switch
                          id={`size-${size}`}
                          checked={selectedShelfSizes.includes(size)}
                          onCheckedChange={() => toggleSizeFilter(size)}
                        />
                        <Label htmlFor={`size-${size}`} className="capitalize">
                          {size}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedShelfTypes([]);
                      setSelectedShelfSizes([]);
                    }}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button size="sm" className="flex-1">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          onClick={handleExportToExcel}
          className="flex gap-1 items-center bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      {compareMode && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Period Comparison</CardTitle>
            <CardDescription>
              Comparing {format(startDate!, "MMM d")} -{" "}
              {format(endDate!, "MMM d, yyyy")} with{" "}
              {format(compareStartDate!, "MMM d")} -{" "}
              {format(compareEndDate!, "MMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm flex items-center gap-1 text-green-500">
                    <RefreshCw className="h-3 w-3" />
                    <span>+12% vs previous period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Max Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-bold">{stats.max}</div>
                  <div className="text-sm flex items-center gap-1 text-green-500">
                    <RefreshCw className="h-3 w-3" />
                    <span>+5% vs previous period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-bold">{stats.avg}</div>
                  <div className="text-sm flex items-center gap-1 text-red-500">
                    <RefreshCw className="h-3 w-3" />
                    <span>-3% vs previous period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Peak Hour Traffic
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-bold">
                    {peakHours[0]?.hour || "N/A"}
                  </div>
                  <div className="text-sm flex items-center gap-1 text-green-500">
                    <RefreshCw className="h-3 w-3" />
                    <span>Same as previous period</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 bg-muted/20 p-1 border">
          <TabsTrigger value="overview" className="font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="detailed" className="font-semibold">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="hourly" className="font-semibold">Hourly Analysis</TabsTrigger>
          <TabsTrigger value="tabular" className="font-semibold">Tabular Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Maximum Shelf Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.max}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avg}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Minimum Shelf Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.min}</div>
              </CardContent>
            </Card>
          </div>

          {/* Круговая диаграмма по типам полок */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribution by Shelf Type</CardTitle>
                <CardDescription>
                  Shows the percentage of interactions by shelf type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Pie
                  data={pieChartDataByType}
                  options={{ maintainAspectRatio: false }}
                />
              </CardContent>
            </Card>

            {/* График посещаемости по часам суммарно */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Hourly Traffic (Total)</CardTitle>
                <CardDescription>
                  Shows the total interactions by hour
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Line data={hourlyTotalData} options={chartOptions} />
              </CardContent>
            </Card>
          </div>

          {/* Пиковые часы */}
          <Card>
            <CardHeader>
              <CardTitle>Peak Hours</CardTitle>
              <CardDescription>
                The most active hours in the store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {peakHours.map((peak, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {peak.hour}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {peak.interactions}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        interactions
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Top полки */}
          <Card>
            <CardHeader>
              <CardTitle>Top Shelves by Interactions</CardTitle>
              <CardDescription>
                The most popular shelves in the store
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <Bar data={verticalBarData} options={chartOptions} />
            </CardContent>
          </Card>

          {/* Взаимодействия по размерам полок */}
          <Card>
            <CardHeader>
              <CardTitle>Interactions by Shelf Size</CardTitle>
              <CardDescription>
                Impact of shelf size on customer engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <Bar data={barChartDataBySize} options={chartOptions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hourly" className="space-y-6">
          {/* Почасовой трафик */}
          <Card>
            <CardHeader>
              <CardTitle>Hourly Traffic by Shelf Type</CardTitle>
              <CardDescription>
                Shows interactions by hour of the day, categorized by shelf type
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 pt-4">
              <TimeSeriesChart
                data={{
                  labels: timeData.labels,
                  datasets: timeData.datasets.map((dataset) => ({
                    ...dataset,
                    shelfId: dataset.shelfId,
                  })),
                }}
                shelves={shelves}
              />
            </CardContent>
          </Card>

          {/* Почасовые взаимодействия суммарно */}
          <Card>
            <CardHeader>
              <CardTitle>Total Hourly Traffic</CardTitle>
              <CardDescription>
                Total interactions across all shelves by hour of day
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <Line data={hourlyTotalData} options={chartOptions} />
            </CardContent>
          </Card>

          {/* Сравнение динамики по полкам */}
          <Card>
            <CardHeader>
              <CardTitle>Shelf Interaction Analysis</CardTitle>
              <CardDescription>
                Comparison of interactions across all shelves
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ShelfInteractionsChart
                data={interactionData.map((item) => ({
                  id: item.id,
                  label: item.name,
                  value: item.value,
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Tabular Data section */}
        <TabsContent value="tabular" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shelf Interactions Data</CardTitle>
              <CardDescription>
                Raw data table that can be sorted and filtered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  Analytics data that can be exported to Excel
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shelf</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Interactions</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell className="text-right">{item.value}</TableCell>
                      <TableCell className="text-right">
                        {Math.round((item.value / stats.total) * 100)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hourly Traffic Data</CardTitle>
              <CardDescription>Hour-by-hour interaction data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Hourly traffic data</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hour</TableHead>
                    {timeData.datasets.map((dataset, index) => {
                      const shelf = shelves.find(
                        (s) => s.id === dataset.shelfId
                      );
                      return (
                        <TableHead key={dataset.shelfId} className="text-right">
                          {shelf
                            ? `${shelf.type} (${shelf.size})`
                            : `Shelf ${index + 1}`}
                        </TableHead>
                      );
                    })}
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeData.labels.map((hour, hourIndex) => (
                    <TableRow key={hour}>
                      <TableCell className="font-medium">{hour}</TableCell>
                      {timeData.datasets.map((dataset) => (
                        <TableCell key={dataset.shelfId} className="text-right">
                          {dataset.data[hourIndex]}
                        </TableCell>
                      ))}
                      <TableCell className="text-right font-bold">
                        {timeData.datasets.reduce(
                          (sum, dataset) => sum + dataset.data[hourIndex],
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
