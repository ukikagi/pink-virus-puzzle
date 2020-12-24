import { Tile } from "./level";
import { Point, MoveDirection, movePoint } from "./point";

export interface Field {
  value: Tile[][];
  width: number;
  height: number;
}

export function getTile(field: Field, p: Point): Tile {
  return field.value[p.y][p.x];
}

export function isInRange(field: Field, p: Point): boolean {
  return 0 <= p.x && p.x < field.width && 0 <= p.y && p.y < field.height;
}

export function canWalkThrough(field: Field, p: Point): boolean {
  return (
    isInRange(field, p) && ![Tile.BRICK, Tile.BLOCK].includes(getTile(field, p))
  );
}

export function isDiggable(field: Field, p: Point): boolean {
  return (
    isInRange(field, p) &&
    getTile(field, p) === Tile.BRICK &&
    canWalkThrough(field, movePoint(p, MoveDirection.UP))
  );
}

export function isFalling(field: Field, p: Point) {
  const pointBelow = movePoint(p, MoveDirection.DOWN);
  return (
    ![Tile.LADDER, Tile.ROPE].includes(getTile(field, p)) &&
    canWalkThrough(field, pointBelow) &&
    ![Tile.LADDER].includes(getTile(field, pointBelow))
  );
}

export function countGold(field: Field) {
  const value = field.value;
  return value.flatMap((row) => row.filter((x) => x === Tile.GOLD)).length;
}
