import { Shelf } from "@/entities/Shelves";

export interface Preset {
  id: string;
  name: string;
  width: number;
  height: number;
  length: number;
  customerNumber: number;

  shelves: Shelf[];
}
