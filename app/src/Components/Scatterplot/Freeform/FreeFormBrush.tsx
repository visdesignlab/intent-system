import React, {FC, useState} from 'react';
import IntentStore from '../../../Store/IntentStore';
import {inject, observer} from 'mobx-react';
import {BrushableRegion} from '../../Brush/Types/BrushableRegion';
import translate from '../../../Utils/Translate';

type Props = {
  store?: IntentStore;
  extents: BrushableRegion;
  extentPadding?: number;
  onBrushStart: () => void;
  onBrush: (x: number, y: number, radius: number) => void;
  onBrushEnd: () => void;
};

const FreeFormBrush: FC<Props> = ({
  extents,
  extentPadding = 0,
  onBrushStart,
  onBrush,
  onBrushEnd,
}: Props) => {
  const {left = 0, right = 0, top = 0, bottom = 0} = extents;

  const radius = 20;

  const [mouseDown, setMouseDown] = useState(false);
  const [mousePosition, setMousePosition] = useState<{x: number; y: number}>({
    x: -1,
    y: -1,
  });

  const [height, width] = [
    Math.abs(bottom + extentPadding - (top - extentPadding)),
    Math.abs(left - extentPadding - (right + extentPadding)),
  ];

  function handleMouseDown() {
    setMouseDown(true);
    onBrushStart();
  }

  function handleMouseUpAndLeave() {
    setMouseDown(false);
    onBrushEnd();
  }

  function handleBrushing(event: React.MouseEvent<SVGElement, MouseEvent>) {
    if (!mouseDown) return;
    const target = event.currentTarget.getBoundingClientRect();
    const [x, y] = [event.clientX - target.left, event.clientY - target.top];
    if (x !== mousePosition.x && y !== mousePosition.y) {
      setMousePosition({x, y});
      onBrush(x, y, radius);
    }
  }

  const {x, y} = mousePosition;

  return (
    <g
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUpAndLeave}
      onMouseUp={handleMouseUpAndLeave}
      onMouseMove={handleBrushing}
      pointerEvents="all"
      transform={translate(-extentPadding, -extentPadding)}>
      <rect opacity="0.1" width={width} height={height} />
      {mouseDown && x >= 0 && y >= 0 && (
        <circle opacity="0.3" fill="blue" r={radius} cx={x} cy={y} />
      )}
    </g>
  );
};

export default inject('store')(observer(FreeFormBrush));
