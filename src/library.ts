export function range(n: number): number[] {
  return Array(n)
    .fill(0)
    .map((_, i) => i);
}

export function make2dArray<T>(h: number, w: number, value: T): T[][] {
  return Array(h)
    .fill(0)
    .map(() => Array(w).fill(value));
}
