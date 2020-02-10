import { getX } from './LinkTransitions';

export default function nodeTransitions(
  xOffset: number,
  yOffset: number,
  backboneOffset: number,
  duration: number = 500
) {
  xOffset = -xOffset;
  backboneOffset = -backboneOffset;
  const start = () => {
    return { x: 0, y: 0, opacity: 0 };
  };

  const enter = (data: any) => {
    const x = getX(data.width, xOffset, backboneOffset);

    return {
      x: [x],
      y: [yOffset * data.depth],
      opactiy: 1,
      timing: { duration }
    };
  };

  const update = (data: any) => {
    const x = getX(data.width, xOffset, backboneOffset);
    return {
      x: [x],
      y: [yOffset * data.depth],
      opactiy: 1,
      timing: { duration }
    };
  };

  return { enter, leave: start, update, start };
}
