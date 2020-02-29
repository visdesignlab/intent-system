export function isWithinCircle(
  x: number,
  y: number,
  cx: number,
  cy: number,
  radius: number,
): boolean {
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}
