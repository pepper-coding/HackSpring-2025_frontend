import type { ShelfSize } from "@/entities/Shelves/model/shelvesSlice";

export const shelfSizes: Record<ShelfSize, [number, number, number]> = {
  small: [1, 1.5, 0.6],
  medium: [1.5, 1.5, 0.6],
  large: [2.5, 1.5, 0.6],
};

export const shelfColors: Record<string, string> = {
  dairy: "#a8e6cf",
  bakery: "#dcedc1",
  produce: "#ffd3b6",
  meat: "#ffaaa5",
  vegetables: "#b8b8ff",
}

export const productColorPalettes: Record<string, string[]> = {
  dairy: ["#e3f2fd", "#bbdefb", "#90caf9", "#64b5f6", "#42a5f5"],
  bakery: ["#fff8e1", "#ffecb3", "#ffe082", "#ffd54f", "#ffca28"],
  produce: ["#e8f5e9", "#c8e6c9", "#a5d6a7", "#81c784", "#66bb6a"],
  meat: ["#ffebee", "#ffcdd2", "#ef9a9a", "#e57373", "#ef5350"],
  vegetables: ["#f3e5f5", "#e1bee7", "#ce93d8", "#ba68c8", "#ab47bc"],
}
