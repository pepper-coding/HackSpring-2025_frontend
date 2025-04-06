export interface Customer {
  id: string;
  position: { x: number; y: number; z: number };
  targetPosition: { x: number; y: number; z: number };
  targetShelfId: string | null;
  speed: number;
  isTakingItem: boolean;
  simulationPath?: [number, number][];
  currentPathIndex?: number;
  visitedShelves?: string[];
}
