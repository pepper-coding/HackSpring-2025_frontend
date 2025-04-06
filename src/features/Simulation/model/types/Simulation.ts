interface Position {
  x: number;
  y: number;
  z: number;
}

interface Shelf {
  id: string;
  position: Position;
  rotation: number;
  interactions: number;
  discount?: number;
}

interface StoreSize {
  width: number;
  length: number;
  height: number;
}

interface StoreConfig {
  storeSize: StoreSize;
  shelves: Shelf[];
  entrance: Position;
  cashDesks: Position[];
  createdAt: string;
}

export interface SimulationRequest {
  config: StoreConfig;
  timeOfDay: string;
  promotions?: string[];
  categories?: string[];
  shelfDiscounts?: Record<string, number>;
  prefersDiscounts?: boolean;
}

export interface SimulationResponse {
  visitors: {
    id: number;
    preferences: string[];
    path: [number, number][];
    queue_time: number;
    visited_shelves: string[];
    final_position: [number, number];
  }[];
  heatmap: number[][];
  events: {
    broken_cash_desk: boolean;
    promotions: string[];
  };
  stats: {
    total_visitors: number;
    avg_queue_time: number;
    max_queue_length: number;
    time_of_day: string;
    calculated_visitors: number;
    cash_desk_queues?: Record<string, number>;
  };
  store_dimensions: {
    width: number;
    length: number;
    grid_size: number;
  };
}
