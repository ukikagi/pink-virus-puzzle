import { range } from "./utils";

export enum Tile {
  BLANK = 0,
  BRICK = 1,
  BLOCK = 2,
  LADDER = 3,
  ROPE = 4,
  EXIT = 5,
  JEWEL = 6,
  CHARA = 7,
}

export interface Level {
  field: Tile[][];
  width: number;
  height: number;
}

export const LEVEL_NROW = 12;
export const LEVEL_NCOL = 12;

export function parseLevel(
  data: string,
  height: number = LEVEL_NROW,
  width: number = LEVEL_NCOL
): Level {
  console.assert(data.length === width * height);
  const field = range(height).map((y) =>
    range(width).map((x) => parseInt(data[y * width + x]))
  );
  return { field, width, height };
}
