import { range, make2dArray } from "./library";

export interface Point {
  x: number;
  y: number;
}

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
  chara: Point;
  exit: Point;
  rest: number;
}

export function readLevel(data: string, height: number, width: number): Level {
  console.assert(data.length == width * height);

  let field: Tile[][] = make2dArray(height, width, Tile.BLANK);
  let chara: Point = { x: 0, y: 0 };
  let exit: Point = { x: 0, y: 0 };
  let rest: number = 0;

  range(height).forEach((y) => {
    range(width).forEach((x) => {
      field[y][x] = parseInt(data[y * width + x]);

      switch (field[y][x]) {
        case Tile.CHARA:
          chara = { x, y };
          field[y][x] = Tile.BLANK;
          break;
        case Tile.EXIT:
          exit = { x, y };
          field[y][x] = Tile.BRICK;
          break;
        case Tile.GOLD:
          rest++;
          break;
      }
    });
  });

  return { field, chara, exit, rest, width, height };
}
