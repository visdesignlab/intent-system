export default function linkTransitions(
  xOffset: number,
  yOffset: number,
  backboneOffset: number,
  duration: number = 500
) {
  xOffset = -xOffset;
  backboneOffset = -backboneOffset;
  const start = () => {
    return { x1: 0, x2: 0, y1: 0, y2: 0, opacity: 0 };
  };

  const enter = (data: any) => {
    const { source, target } = data;
    const x1 = xOffset * source.width;
    const x2 = xOffset * target.width;
    const y1 = yOffset * source.depth;
    const y2 = yOffset * target.depth;

    return { x1, x2, y1, y2, opacity: 1, timing: { duration } };
  };

  const update = (data: any) => {
    const { source, target } = data;
    const x1 = getX(source.width, xOffset, backboneOffset);
    const x2 = getX(target.width, xOffset, backboneOffset);

    const y1 = yOffset * source.depth;
    const y2 = yOffset * target.depth;
    return {
      x1: [x1],
      y1: [y1],
      x2: [x2],
      y2: [y2],
      opacity: 1,
      timing: { duration }
    };
  };

  return { enter, leave: start, update, start };
}

export function getX(width: number, xOffset: number, backboneOffset: number) {
  return width > 1
    ? (xOffset + backboneOffset) * width - backboneOffset
    : (xOffset + backboneOffset) * width;
}
