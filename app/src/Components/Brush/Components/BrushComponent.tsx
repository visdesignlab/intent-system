import React, { FC, memo, useEffect, useRef, useState } from 'react';

import getBrushId from '../../../Utils/BrushIDGen';
import { Brush, BrushAffectType, BrushCollection } from '../Types/Brush';
import { BrushableRegion } from '../Types/BrushableRegion';
import SingleBrushComponent from './SingleBrushComponent';

export type BrushUpdateFunction = (
  brushes: BrushCollection,
  affectedBrush: Brush,
  affectType: BrushAffectType,
  mousePosition?: MousePosition
) => void;

interface Props {
  extents: BrushableRegion;
  showBrushBorder?: boolean;
  extentPadding?: number;
  onBrushUpdate: BrushUpdateFunction;
  clearAllBrushSetup?: (handler: () => void) => void;
  initialBrushes?: BrushCollection;
  switchOff?: boolean;
}

type MousePosition = { x: number; y: number };

const BrushComponent: FC<Props> = ({
  extents,
  showBrushBorder,
  clearAllBrushSetup,
  onBrushUpdate,
  extentPadding = 0,
  initialBrushes = {},
  switchOff = true
}: Props) => {
  const { left, right, top, bottom } = extents;
  const [height, width] = [
    Math.abs(bottom + extentPadding - (top - extentPadding)),
    Math.abs(left - extentPadding - (right + extentPadding))
  ];
  const ibString = JSON.stringify(initialBrushes);

  // Refs
  const overlayRef = useRef<SVGRectElement>(null);

  // State
  const [mouseDown, setMouseDown] = useState(false);
  const [baseBrushes, setBrushes] = useState<BrushCollection>({});
  const [activeBrushId, setActiveBrushId] = useState<string | null>(null);

  // Effects
  useEffect(() => {
    const initalBrushes: BrushCollection = JSON.parse(ibString);
    if (initalBrushes) setBrushes(initalBrushes);
  }, [ibString]);

  // Event Add Effect
  useEffect(() => {
    if (!mouseDown) return;
    addEvents();
    return removeEvents;
  });

  // Copies
  const brushes: BrushCollection = JSON.parse(JSON.stringify(baseBrushes));

  // Handlers
  function handleMouseDown(
    event: React.MouseEvent<SVGRectElement, MouseEvent>
  ) {
    const currentTarget = event.currentTarget.getBoundingClientRect();
    const brush: Brush = {
      id: getBrushId(),
      extents: {
        x1: (event.clientX - currentTarget.left) / width,
        x2: (event.clientX - currentTarget.left) / width,
        y1: (event.clientY - currentTarget.top) / height,
        y2: (event.clientY - currentTarget.top) / height
      }
    };
    brushes[brush.id] = brush;
    setMouseDown(true);
    setBrushes(brushes);
    setActiveBrushId(brush.id);
  }

  function handleMouseMove(event: MouseEvent) {
    const targetNode = overlayRef.current;
    if (!targetNode || !activeBrushId || !brushes[activeBrushId]) return;

    const currentBrush = brushes[activeBrushId];
    const target = targetNode.getBoundingClientRect();
    const { left, top } = target;

    let x1 = currentBrush.extents.x1;
    let y1 = currentBrush.extents.y1;
    let x2 = (event.clientX - left) / width;
    let y2 = (event.clientY - top) / height;

    if (x2 * width < 0 || x2 * width > width) {
      x2 = currentBrush.extents.x2;
    }
    if (y2 * height < 0 || y2 * height > height) {
      y2 = currentBrush.extents.y2;
    }

    currentBrush.extents = { x1, x2, y1, y2 };
    brushes[activeBrushId] = currentBrush;
    if (JSON.stringify(brushes) !== JSON.stringify(baseBrushes))
      setBrushes(brushes);
  }

  function handleMouseUp(event: MouseEvent) {
    const targetNode = overlayRef.current;
    if (!targetNode || !activeBrushId || !brushes[activeBrushId])
      throw new Error("Something went wrong in create brush mouse up handler");

    const target = targetNode.getBoundingClientRect();
    const { left, top } = target;
    const currentBrush = brushes[activeBrushId];
    let { x1, x2, y1, y2 } = currentBrush.extents;
    const isNewBrushRedundant = x1 === x2 || y1 === y2;

    if (isNewBrushRedundant) {
      delete brushes[activeBrushId];
    } else {
      if (x1 > x2) [x1, x2] = [x2, x1];
      if (y1 > y2) [y1, y2] = [y2, y1];

      currentBrush.extents = { x1, x2, y1, y2 };
      brushes[activeBrushId] = currentBrush;

      onBrushUpdate(brushes, currentBrush, "Add", {
        x: event.clientX - left,
        y: event.clientY - top
      });

      if (JSON.stringify(brushes) !== JSON.stringify(baseBrushes))
        setBrushes(brushes);
    }

    setMouseDown(false);
    setActiveBrushId(null);
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

  // Components
  const overlay = (
    <rect
      ref={overlayRef}
      height={height}
      width={width}
      fill="none"
      cursor="crosshair"
      stroke="black"
      pointerEvents="all"
      onMouseDown={handleMouseDown}
    />
  );

  const brs = Object.values(brushes).map(brush => {
    let { x1, y1, x2, y2 } = correctBrushExtents(brush.extents);
    [x1, y1, x2, y2] = [x1 * width, y1 * height, x2 * width, y2 * height];
    return (
      <SingleBrushComponent
        key={brush.id}
        brushId={brush.id}
        x={x1}
        y={y1}
        width={x2 - x1}
        height={y2 - y1}
        extentHeight={height}
        extentWidth={width}
        overlayRef={overlayRef}
        onBrushUpdate={onBrushUpdate}
        brushes={brushes}
      />
    );
  });

  const [first, second] = mouseDown ? [brs, overlay] : [overlay, brs];

  return (
    <g
      id="brush-component"
      transform={`translate(${left - extentPadding}, ${top - extentPadding})`}
    >
      {first}
      {second}
    </g>
  );
};

(BrushComponent as any).whyDidYouRender = true;
export default memo(BrushComponent);

export function correctBrushExtents(input: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}) {
  let { x1, x2, y1, y2 } = input;

  if (x2 < x1) {
    [x1, x2] = [x2, x1];
  }

  if (y2 < y1) {
    [y1, y2] = [y2, y1];
  }

  return { x1, x2, y1, y2 };
}
