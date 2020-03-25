import { select } from 'd3';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import translate from '../../../Utils/Translate';
import { Brush, BrushCollection } from '../Types/Brush';
import { BrushUpdateFunction } from './BrushComponent';

interface Props {
  x: number;
  y: number;
  height: number;
  width: number;
  brushId: string;
  extentHeight: number;
  extentWidth: number;
  extentPadding: number;
  resizeControlSize?: number;
  overlayRef: React.RefObject<SVGRectElement>;
  onBrushUpdate: BrushUpdateFunction;
  brushes: BrushCollection;
  onResizeStart: (brushId: string, resizeDirection: ResizeDirection) => void;
  removeBrush: (brushId: string) => void;
}

export type ResizeDirection =
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
  height,
  width,
  extentHeight,
  extentWidth,
  overlayRef,
  onBrushUpdate,
  brushes,
  brushId,
  onResizeStart,
  removeBrush,
  extentPadding
}: Props) {
  // States
  const [mouseDown, setMouseDown] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: initX,
    y: initY
  });
  const [diff, setDiff] = useState<{
    diffX: number;
    diffY: number;
  } | null>(null);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [timeoutClear, setTimeoutClear] = useState(-1);

  // Destructuring
  const { x, y } = position;

  // Ref
  const brushRef = useRef<SVGRectElement>(null);

  // Event Add Effect
  useEffect(() => {
    if (!mouseDown) return;
    addEvents();
    return removeEvents;
  });

  useEffect(() => {
    if (JSON.stringify(position) !== JSON.stringify({ x: initX, y: initY }))
      setPosition({ x: initX, y: initY });
  }, [initX, initY]);

  useEffect(() => {
    return () => {
      clearInterval(timeoutClear);
    };
  });

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

    if (
      newX < 0 - extentPadding ||
      newX + width > extentWidth + extentPadding
    ) {
      newX = x;
    }

    if (
      newY < 0 - extentPadding ||
      newY + height > extentHeight + extentPadding
    ) {
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

  // Add/Remove Events
  function addEvents() {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
  }

  function removeEvents() {
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mousemove", handleMouseMove);
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
        onMouseEnter={_ => {
          clearInterval(timeoutClear);
          setShowCloseIcon(true);
        }}
        onMouseLeave={_ => {
          const tout = setTimeout(() => setShowCloseIcon(false), 900);
          setTimeoutClear(tout);
        }}
      />
      {width - 2 * resizeRectSize >= 0 && (
        <VerticalResizeRectangle
          x={x + resizeRectSize}
          y={y - resizeRectSize / 2}
          height={resizeRectSize}
          width={width - 2 * resizeRectSize}
          onMouseDown={() => onResizeStart(brushId, "Top")}
        />
      )}
      {width - 2 * resizeRectSize >= 0 && (
        <VerticalResizeRectangle
          x={x + resizeRectSize}
          y={y + height - resizeRectSize / 2}
          height={resizeRectSize}
          width={width - 2 * resizeRectSize}
          onMouseDown={() => onResizeStart(brushId, "Bottom")}
        />
      )}
      {height - 2 * resizeRectSize >= 0 && (
        <HorizontalResizeRectangle
          x={x - resizeRectSize / 2}
          y={y + resizeRectSize}
          height={height - 2 * resizeRectSize}
          width={resizeRectSize}
          onMouseDown={() => onResizeStart(brushId, "Left")}
        />
      )}

      {height - 2 * resizeRectSize >= 0 && (
        <HorizontalResizeRectangle
          x={x + width - resizeRectSize / 2}
          y={y + resizeRectSize}
          height={height - 2 * resizeRectSize}
          width={resizeRectSize}
          onMouseDown={() => onResizeStart(brushId, "Right")}
        />
      )}

      <TLBRResizeRectangle
        x={x - resizeRectSize / 2}
        y={y - resizeRectSize / 2}
        height={resizeRectSize}
        width={resizeRectSize}
        onMouseDown={() => onResizeStart(brushId, "Top Left")}
      />
      <TLBRResizeRectangle
        x={x + width - resizeRectSize / 2}
        y={y + height - resizeRectSize / 2}
        height={resizeRectSize}
        width={resizeRectSize}
        onMouseDown={() => onResizeStart(brushId, "Bottom Right")}
      />
      <TRBLResizeRectangle
        x={x - resizeRectSize / 2}
        y={y + height - resizeRectSize / 2}
        height={resizeRectSize}
        width={resizeRectSize}
        onMouseDown={() => onResizeStart(brushId, "Bottom Left")}
      />
      <TRBLResizeRectangle
        x={x + width - resizeRectSize / 2}
        y={y - resizeRectSize / 2}
        height={resizeRectSize}
        width={resizeRectSize}
        onMouseDown={() => onResizeStart(brushId, "Top Right")}
      />
      <g
        className="close-icon"
        display={showCloseIcon ? "visible" : "none"}
        transform={translate(x + width, y)}
      >
        <CloseIcon dominantBaseline="middle" textAnchor="middle">
          &#xf05e;
        </CloseIcon>
        <RemoveBrushCircle
          r="10"
          onClick={() => {
            removeBrush(brushId);
          }}
        />
      </g>
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
  opacity: 0;
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

export function drawAtPosition(x: number, y: number) {
  select("#brush-component")
    .append("circle")
    .attr("r", 5)
    .attr("cx", x)
    .attr("cy", y)
    .style("fill", "red");
}
