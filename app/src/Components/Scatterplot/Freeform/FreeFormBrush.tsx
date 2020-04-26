import { select } from 'd3';
import { inject, observer } from 'mobx-react';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { style } from 'typestyle';

import IntentStore from '../../../Store/IntentStore';
import translate from '../../../Utils/Translate';
import { BrushableRegion } from '../../Brush/Types/BrushableRegion';
import { union_color } from '../../Styles/MarkStyle';
import { MousePosition } from '../RawPlot';

type BrushStartHandler = (x: number, y: number, radius: number) => void;
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
  store,
}: Props) => {
  const brushRef = useRef<SVGCircleElement>(null);
  const layerRef = useRef<SVGRectElement>(null);
  const { left = 0, right = 0, top = 0, bottom = 0 } = extents;

  const { brushSize } = store!;

  const radius = parseInt(brushSize) || 20;

  const [mouseIn, setMouseIn] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  const [height, width] = [
    Math.abs(bottom + extentPadding - (top - extentPadding)),
    Math.abs(left - extentPadding - (right + extentPadding)),
  ];

  function handleMouseDown(event: React.MouseEvent<SVGElement, MouseEvent>) {
    const targetNode = layerRef.current;
    if (targetNode) {
      const target = targetNode.getBoundingClientRect();
      const [x, y] = [event.clientX - target.left, event.clientY - target.top];
      if (onBrushStart) {
        onBrushStart(x, y, radius);
      }
    }
    setMouseDown(true);
  }

  function handleMouseUp(event: MouseEvent) {
    const targetNode = layerRef.current;
    if (targetNode) {
      const target = targetNode.getBoundingClientRect();
      const [x, y] = [event.clientX - target.left, event.clientY - target.top];
      if (onBrushEnd) {
        onBrushEnd({ x, y });
      }
    }
    setMouseDown(false);
  }

  function handleMove(event: MouseEvent) {
    if (!mouseIn) return;
    const node = brushRef.current;
    const targetNode = layerRef.current;
    if (node && targetNode) {
      const target = targetNode.getBoundingClientRect();
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

  function addEvent() {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function removeEvent() {
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  useEffect(() => {
    addEvent();
    return removeEvent;
  });

  const strokeColor = mouseDown ? union_color : "gray";

  return (
    <g
      onMouseDown={handleMouseDown}
      transform={translate(-extentPadding, -extentPadding)}
      onMouseEnter={() => setMouseIn(true)}
      onMouseLeave={() => {
        if (!mouseDown) setMouseIn(false);
      }}
    >
      <rect
        ref={layerRef}
        fill="none"
        pointerEvents="all"
        width={width}
        height={height}
      />
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

// (FreeFormBrush as any).whyDidYouRender = true;
export default memo(inject("store")(observer(FreeFormBrush)));

const brushStyle = style({
  cursor: "grabbing",
});
