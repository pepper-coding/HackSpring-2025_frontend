import { ShelfSize, ShelfType } from "../../model/shelvesSlice";

export interface CreateShelfDto {
  name: string;
  type: ShelfType;
  size: ShelfSize;
  x: number;
  y: number;
  presetId: string;
}
