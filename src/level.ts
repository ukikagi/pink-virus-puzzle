import { Field } from "./field";
import { Point } from "./point";
import { clone2dArray, range } from "./utils";

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

export function parseLevel(data: string, height: number, width: number): Level {
  console.assert(data.length === width * height);
  const field = range(height).map((y) =>
    range(width).map((x) => parseInt(data[y * width + x]))
  );
  return { field, width, height };
}

export function createModel(level: Level) {
  const width = level.width;
  const height = level.height;

  let value: Tile[][] = clone2dArray(level.field);
  let chara: Point = { x: 0, y: 0 };
  let exit: Point = { x: 0, y: 0 };

  range(height).forEach((y) => {
    range(width).forEach((x) => {
      switch (value[y][x]) {
        case Tile.CHARA:
          value[y][x] = Tile.BLANK;
          chara = { x, y };
          break;
        case Tile.EXIT:
          value[y][x] = Tile.BRICK;
          exit = { x, y };
          break;
      }
    });
  });

  const field: Field = { value, width, height };
  return { field, chara, exit };
}
