import { range } from "./utils";

export enum Tile {
  BLANK = 0,
  BRICK = 1,
  BLOCK = 2,
  LADDER = 3,
  ROPE = 4,
  EXIT = 5,
  GOLD = 6,
  CHARA = 7,
}

export interface Level {
  field: Tile[][];
  width: number;
  height: number;
}

export function readLevel(data: string, height: number, width: number): Level {
  console.assert(data.length === width * height);
  const field = range(height).map((y) =>
    range(width).map((x) => parseInt(data[y * width + x]))
  );
  return { field, width, height };
}
