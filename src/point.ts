export interface Point {
  x: number;
  y: number;
}

export enum Direction {
  RIGHT = 0,
  DOWN = 1,
  LEFT = 2,
  UP = 3,
}

export function movePoint(p: Point, d: Direction): Point {
  const dx = [1, 0, -1, 0];
  const dy = [0, 1, 0, -1];
  return { x: p.x + dx[d], y: p.y + dy[d] };
}
