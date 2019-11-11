export function hashCode(s: string) {
  for (var i = 0, h = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `hash${h < 0 ? -h : h}`;
}

export function areEqual<T>(object1: T, object2: T): boolean {
  return JSON.stringify(object1) === JSON.stringify(object2);
}

export function getRandomUserCode(): string {
  return (
    Math.random()
      .toString(36)
      .substring(2, 10) +
    Math.random()
      .toString(36)
      .substring(2, 10)
  ).toUpperCase();
}
