import { select } from 'd3';
import { inject, observer } from 'mobx-react';
import React, { createRef, FC, useReducer, useState } from 'react';
import { style } from 'typestyle';

import IntentStore from '../../../Store/IntentStore';
import translate from '../../../Utils/Translate';
import { BrushableRegion } from '../../Brush/Types/BrushableRegion';
import { union_color } from '../../Styles/MarkStyle';
import { MousePosition } from '../RawPlot';

type BrushStartHandler = () => void;
type BrushMoveHandler = (x: number, y: number, radius: number) => void;
type BrushEndHandler = (mousePos?: MousePosition) => void;

type Props = {
  store?: IntentStore;
  extents: BrushableRegion;
  extentPadding?: number;
  onBrushStart?: BrushStartHandler;
  onBrush?: BrushMoveHandler;
  onBrushEnd?: BrushEndHandler;
};

const FreeFormBrush: FC<Props> = ({
  extents,
  extentPadding = 0,
  onBrushStart,
  onBrush,
  onBrushEnd,
  store
}: Props) => {
  const brushRef = createRef<SVGCircleElement>();
  const { left = 0, right = 0, top = 0, bottom = 0 } = extents;

  const { brushSize } = store!;

  const radius = parseInt(brushSize) || 20;

  const [mouseDown, setMouseDown] = useState(false);

  const [height, width] = [
    Math.abs(bottom + extentPadding - (top - extentPadding)),
    Math.abs(left - extentPadding - (right + extentPadding))
  ];

  function handleMouseDown() {
    setMouseDown(true);

    if (onBrushStart) {
      onBrushStart();
    }
  }

  function handleMouseUpAndLeave(
    event: React.MouseEvent<SVGCircleElement, MouseEvent>
  ) {
    const target = event.currentTarget.getBoundingClientRect();
    const [x, y] = [event.clientX - target.left, event.clientY - target.top];
    setMouseDown(false);

    if (onBrushEnd) {
      onBrushEnd({ x, y });
    }
  }

  function handleMove(event: React.MouseEvent<SVGCircleElement, MouseEvent>) {
    const node = brushRef.current;
    if (node) {
      const target = event.currentTarget.getBoundingClientRect();
      const [x, y] = [event.clientX - target.left, event.clientY - target.top];

      const nodeSelection = select(node);

      const edgeX = x + radius >= width + 10 || x - radius <= -10;
      const edgeY = y + radius >= height + 10 || y - radius <= -10;

      if (!edgeX) nodeSelection.attr("cx", x);

      if (!edgeY) nodeSelection.attr("cy", y);
      if (onBrush && mouseDown) {
        onBrush(x, y, radius);
      }
    }
  }

  const strokeColor = mouseDown ? union_color : "gray";

  return (
    <g
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUpAndLeave}
      onMouseLeave={handleMouseUpAndLeave}
      onMouseMove={handleMove}
      transform={translate(-extentPadding, -extentPadding)}
    >
      <rect fill="none" pointerEvents="all" width={width} height={height} />
      <circle
        className={brushStyle}
        pointerEvents={mouseDown ? "all" : "initial"}
        ref={brushRef}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        r={radius}
      />
    </g>
  );
};

export default inject("store")(observer(FreeFormBrush));

const brushStyle = style({
  cursor: "grabbing"
});
