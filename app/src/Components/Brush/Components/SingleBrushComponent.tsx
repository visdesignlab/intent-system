import { select } from 'd3';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Brush, BrushCollection } from '../Types/Brush';
import { BrushUpdateFunction, correctBrushExtents } from './BrushComponent';

interface Props {
  x: number;
  y: number;
  height: number;
  width: number;
  brushId: string;
  extentHeight: number;
  extentWidth: number;
  resizeControlSize?: number;
  overlayRef: React.RefObject<SVGRectElement>;
  onBrushUpdate: BrushUpdateFunction;
  brushes: BrushCollection;
}

type ResizeDirection =
  | "Left"
  | "Right"
  | "Top"
  | "Bottom"
  | "Top Left"
  | "Top Right"
  | "Bottom Left"
  | "Bottom Right";

function SingleBrushComponent({
  x: initX,
  y: initY,
  height: initHeight,
  width: initWidth,
  extentHeight,
  extentWidth,
  overlayRef,
  onBrushUpdate,
  brushes,
  brushId
}: Props) {
  // States
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDownResize, setMouseDownResize] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: initX,
    y: initY
  });
  const [brushSize, setBrushSize] = useState<{ height: number; width: number }>(
    {
      height: initHeight,
      width: initWidth
    }
  );
  const [diff, setDiff] = useState<{
    diffX: number;
    diffY: number;
  } | null>(null);
  const [
    resizeDirection,
    setResizeDirection
  ] = useState<ResizeDirection | null>(null);

  // Destructuring
  const { x, y } = position;
  const { height, width } = brushSize;

  // Ref
  const brushRef = useRef<SVGRectElement>(null);

  // Event Add Effect
  useEffect(() => {
    if (!mouseDown) return;
    addEvents();
    return removeEvents;
  });

  useEffect(() => {
    if (!mouseDownResize) return;
    addEventsForResize();
    return removeEventsForResize;
  });

  useEffect(() => {
    setPosition(pos => {
      const { x, y } = pos;
      if (x !== initX || y !== initY) {
        return { x: initX, y: initY };
      } else return pos;
    });
    setBrushSize(size => {
      const { height, width } = size;
      if (height !== initHeight || width !== initWidth) {
        return { height: initHeight, width: initWidth };
      } else return size;
    });
  }, [initX, initY, initHeight, initWidth]);

  function drawAtPosition(x: number, y: number) {
    select("#brush-component")
      .append("circle")
      .attr("r", 5)
      .attr("cx", x)
      .attr("cy", y)
      .style("fill", "red");
  }

  // Drag Handlers
  function handleMouseDown(
    event: React.MouseEvent<SVGRectElement, MouseEvent>
  ) {
    const targetNode = overlayRef.current;
    if (!targetNode) throw new Error("Error in drag start");
    const target = targetNode.getBoundingClientRect();
    const { left, top } = target;
    const [currX, currY] = [event.clientX - left, event.clientY - top];
    const [diffX, diffY] = [Math.abs(currX - x), Math.abs(currY - y)];

    setDiff({ diffX, diffY });
    setMouseDown(true);
  }

  function handleMouseMove(event: MouseEvent) {
    const targetNode = overlayRef.current;
    if (!targetNode || !diff) return;
    const { diffX, diffY } = diff;
    const target = targetNode.getBoundingClientRect();
    const { left, top } = target;
    let [newX, newY] = [
      event.clientX - left - diffX,
      event.clientY - top - diffY
    ];

    if (newX < 0 || newX + width > extentWidth) {
      newX = x;
    }

    if (newY < 0 || newY + height > extentHeight) {
      newY = y;
    }
    const pos = { x: newX, y: newY };
    if (JSON.stringify(pos) !== JSON.stringify(position)) setPosition(pos);
  }

  function handleMouseUp(event: MouseEvent) {
    const brushesCopy = JSON.parse(JSON.stringify(brushes));

    let [x1, x2, y1, y2] = [
      x / extentWidth,
      (x + width) / extentWidth,
      y / extentHeight,
      (y + height) / extentHeight
    ];

    const brs: Brush = {
      id: brushId,
      extents: {
        x1,
        x2,
        y1,
        y2
      }
    };
    brushesCopy[brushId] = brs;

    onBrushUpdate(brushesCopy, brs, "Change");
    setDiff(null);
    setMouseDown(false);
  }

  // Resize Handlers
  function handleResizeDown(
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    resizeDirection: ResizeDirection
  ) {
    setMouseDownResize(true);
    setResizeDirection(resizeDirection);
  }

  function handleResizeMove(event: MouseEvent) {
    const targetNode = overlayRef.current;
    if (!targetNode) return;
    const target = targetNode.getBoundingClientRect();
    const { left, top } = target;
    let [newX, newY] = [event.clientX - left, event.clientY - top];

    const { height, width } = brushSize;
    let [x1, x2, y1, y2] = [x, x + width, y, y + height];

    switch (resizeDirection) {
      case "Top":
        y1 += event.movementY;
        break;
      default:
        return;
    }

    const temp = correctBrushExtents({ x1, x2, y1, y2 });
    [x1, x2, y1, y2] = [temp.x1, temp.x2, temp.y1, temp.y2];
    const [newHeight, newWidth] = [Math.abs(y2 - y1), Math.abs(x2 - x1)];

    if (JSON.stringify({ x: x1, y: y1 }) !== JSON.stringify(position))
      setPosition({ x: x1, y: y1 });

    if (
      JSON.stringify({ height: newHeight, width: newWidth }) !==
      JSON.stringify(brushSize)
    )
      setBrushSize({ height: newHeight, width: newWidth });
  }

  function handleResizeUp(event: MouseEvent) {
    setResizeDirection(null);
    setMouseDownResize(false);
  }

  // Add/Remove Events
  function addEvents() {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
  }

  function removeEvents() {
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mousemove", handleMouseMove);
  }

  // Add resize events
  function addEventsForResize() {
    window.addEventListener("mouseup", handleResizeUp);
    window.addEventListener("mousemove", handleResizeMove);
  }

  function removeEventsForResize() {
    window.removeEventListener("mouseup", handleResizeUp);
    window.removeEventListener("mousemove", handleResizeMove);
  }

  const resizeRectSize = 7;

  return (
    <>
      <BrushRectangle
        ref={brushRef}
        x={x}
        y={y}
        height={height}
        width={width}
        onMouseDown={handleMouseDown}
      />
      {width - 2 * resizeRectSize >= 0 && (
        <VerticalResizeRectangle
          x={x + resizeRectSize}
          y={y - resizeRectSize / 2}
          height={resizeRectSize}
          width={width - 2 * resizeRectSize}
          onMouseDown={event => handleResizeDown(event, "Top")}
        />
      )}
      {/* <HorizontalResizeRectangle
        x={x2 - resizeControlSize / 2}
        y={y1 + resizeControlSize / 2}
        height={
          y2 - y1 - resizeControlSize < 0 ? 0 : y2 - y1 - resizeControlSize
        }
        width={resizeControlSize}
      />
      <VerticalResizeRectangle
        x={x1 + resizeControlSize / 2}
        y={y1 - resizeControlSize / 2}
        height={resizeControlSize}
        width={
          x2 - x1 - resizeControlSize < 0 ? 0 : x2 - x1 - resizeControlSize
        }
      />
      <VerticalResizeRectangle
        x={x1 + resizeControlSize / 2}
        y={y2 - resizeControlSize / 2}
        height={resizeControlSize}
        width={
          x2 - x1 - resizeControlSize < 0 ? 0 : x2 - x1 - resizeControlSize
        }
      />
      <TLBRResizeRectangle
        x={x1 - resizeControlSize / 2}
        y={y1 - resizeControlSize / 2}
        height={resizeControlSize}
        width={resizeControlSize}
      />
      <TLBRResizeRectangle
        x={x2 - resizeControlSize / 2}
        y={y2 - resizeControlSize / 2}
        height={resizeControlSize}
        width={resizeControlSize}
      />
      <TRBLResizeRectangle
        x={x2 - resizeControlSize / 2}
        y={y1 - resizeControlSize / 2}
        height={resizeControlSize}
        width={resizeControlSize}
      />
      <TRBLResizeRectangle
        x={x1 - resizeControlSize / 2}
        y={y2 - resizeControlSize / 2}
        height={resizeControlSize}
        width={resizeControlSize}
      /> */}
    </>
  );
}

(SingleBrushComponent as any).whyDidYouRender = true;
export default memo(SingleBrushComponent);

const BrushRectangle = styled("rect")`
  fill: lightgray;
  opacity: 0.2;
  stroke: black;
  stroke-width: 1.5px;
  cursor: move;
  pointer-events: all;
`;

const ResizeRectangle = styled(BrushRectangle)`
  stroke: darkred;
  fill: red;
  opacity: 0.5;
`;

const HorizontalResizeRectangle = styled(ResizeRectangle)`
  cursor: ew-resize;
`;

const VerticalResizeRectangle = styled(ResizeRectangle)`
  cursor: ns-resize;
`;

const TLBRResizeRectangle = styled(ResizeRectangle)`
  cursor: nwse-resize;
`;

const TRBLResizeRectangle = styled(ResizeRectangle)`
  cursor: nesw-resize;
`;

const CloseIcon = styled("text")`
  font-family: FontAwesome;
  font-size: 1.5em;
  fill: red;
`;

const RemoveBrushCircle = styled("circle")`
  cursor: pointer;
  fill: #777;
  opacity: 0.01;
`;
