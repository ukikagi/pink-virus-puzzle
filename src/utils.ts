export function range(n: number): number[] {
  return Array(n)
    .fill(0)
    .map((_, i) => i);
}

export function clone2dArray<T>(xss: T[][]): T[][] {
  return xss.map((xs) => [...xs]);
}
