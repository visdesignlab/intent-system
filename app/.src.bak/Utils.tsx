export function hashCode(s: string) {
  for (var i = 0, h = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `hash${h < 0 ? -h : h}`;
}
