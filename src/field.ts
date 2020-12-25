import { Tile } from "./level";
import { Point, Direction, movePoint } from "./point";

export interface Field {
  value: Tile[][];
  width: number;
  height: number;
}

export function getTile(field: Field, p: Point): Tile {
  return field.value[p.y][p.x];
}

export function setTile(mutableField: Field, p: Point, tile: Tile): void {
  mutableField.value[p.y][p.x] = tile;
}

export function isInRange(field: Field, p: Point): boolean {
  return 0 <= p.x && p.x < field.width && 0 <= p.y && p.y < field.height;
}

export function canGoThrough(field: Field, p: Point): boolean {
  return (
    isInRange(field, p) && ![Tile.BRICK, Tile.BLOCK].includes(getTile(field, p))
  );
}

export function isBreakable(field: Field, p: Point): boolean {
  return (
    isInRange(field, p) &&
    getTile(field, p) === Tile.BRICK &&
    canGoThrough(field, movePoint(p, Direction.UP))
  );
}

export function isFalling(field: Field, p: Point) {
  const pointBelow = movePoint(p, Direction.DOWN);
  return (
    ![Tile.LADDER, Tile.ROPE, Tile.EXIT].includes(getTile(field, p)) &&
    canGoThrough(field, pointBelow) &&
    ![Tile.LADDER].includes(getTile(field, pointBelow))
  );
}

export function countJewel(field: Field) {
  const value = field.value;
  return value.flatMap((row) => row.filter((x) => x === Tile.JEWEL)).length;
}
