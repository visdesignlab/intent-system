import React, { createRef, FC, useEffect, useRef, useState } from 'react';

import { MousePosition } from '../../Scatterplot/RawPlot';
import { Brush, BrushAffectType, BrushCollection } from '../Types/Brush';
import { BrushableRegion } from '../Types/BrushableRegion';
import { BrushResizeType } from '../Types/BrushResizeEnum';
import SingleBrushComponent from './SingleBrushComponent';

interface Props {
  extents: BrushableRegion;
  showBrushBorder?: boolean;
  extentPadding?: number;
  onBrushUpdate: (
    brushes: BrushCollection,
    affectedBrush: Brush,
    affectType: BrushAffectType,
    mousePosition?: MousePosition
  ) => void;
  clearAllBrushSetup?: (handler: () => void) => void;
  initialBrushes?: BrushCollection;
  switchOff?: boolean;
}

const BrushComponent: FC<Props> = ({
  extents,
  showBrushBorder,
  clearAllBrushSetup,
  onBrushUpdate,
  extentPadding,
  initialBrushes,
  switchOff = true
}: Props) => {
  if (!extentPadding) extentPadding = 0;

  const layerRef = createRef<SVGRectElement>();

  const { top, left, right, bottom } = extents;
  const [height, width] = [
    Math.abs(bottom + extentPadding - (top - extentPadding)),
    Math.abs(left - extentPadding - (right + extentPadding))
  ];

  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [brushes, setBrushes] = useState<BrushCollection>({});
  const [currentBrush, setCurrentBrush] = useState<Brush>(null as any);
  const [isCreatingNewBrush, setIsCreatingNewBrush] = useState<boolean>(false);
  const [movingBrush, setMovingBrush] = useState<boolean>(false);
  const [mouseDownForResize, setMouseDownForResize] = useState<boolean>(false);
  const [resizeDirection, setResizeDirection] = useState<BrushResizeType>(
    null as any
  );
  const brushGroupRef = useRef<SVGGElement>(null);

  const initialBrushString = JSON.stringify(initialBrushes);

  useEffect(() => {
    const initialBrushes = JSON.parse(initialBrushString);
    if (initialBrushes) {
      setBrushes(initialBrushes);
    }
  }, [initialBrushString]);

  const handleMouseDownWhenCreating = <T extends SVGElement>(
    event: React.MouseEvent<T, MouseEvent>
  ) => {
    setMouseDown(true);
    const currentTarget = event.currentTarget.getBoundingClientRect();
    const brush: Brush = {
      id: new Date().getTime().toString(),
      extents: {
        x1: (event.clientX - currentTarget.left) / width,
        x2: (event.clientX - currentTarget.left) / width,
        y1: (event.clientY - currentTarget.top) / height,
        y2: (event.clientY - currentTarget.top) / height
      }
    };
    brushes[brush.id] = brush;

    setCurrentBrush(brush);
    setBrushes({ ...brushes });
    setIsCreatingNewBrush(true);
  };

  const handleMouseMoveWhenCreating = <T extends SVGGElement>(
    event: React.MouseEvent<T, MouseEvent>
  ) => {
    if (!mouseDown) return;
    const currentTarget = event.currentTarget.getBoundingClientRect();
    let x1 = currentBrush.extents.x1;
    let y1 = currentBrush.extents.y1;
    let x2 = (event.clientX - currentTarget.left) / width;
    let y2 = (event.clientY - currentTarget.top) / height;

    currentBrush.extents = { x1, x2, y1, y2 };

    brushes[currentBrush.id] = currentBrush;
    setBrushes({ ...brushes });
  };

  const handleMouseUpWhenCreating = <T extends SVGGElement>(
    event: React.MouseEvent<T, MouseEvent>
  ) => {
    const currentTarget = event.currentTarget.getBoundingClientRect();

    const isNewBrushZero =
      currentBrush.extents &&
      (currentBrush.extents.x1 === currentBrush.extents.x2 ||
        currentBrush.extents.y1 === currentBrush.extents.y2);

    if (isNewBrushZero) {
      delete brushes[currentBrush.id];
    } else {
      const curr = currentBrush;
      let { x1, x2, y1, y2 } = curr.extents;

      if (x1 > x2) [x1, x2] = [x2, x1];
      if (y1 > y2) [y1, y2] = [y2, y1];

      curr.extents = { x1, x2, y1, y2 };
      brushes[curr.id] = curr;

      onBrushUpdate({ ...brushes }, curr, "Add", {
        x: event.clientX - currentTarget.left,
        y: event.clientY - currentTarget.top
      });
    }

    setCurrentBrush(null as any);
    setMouseDown(false);
    setIsCreatingNewBrush(false);
  };

  const handleDragStart = <T extends SVGElement>(
    _: React.MouseEvent<T, MouseEvent>,
    brush: Brush
  ) => {
    setMouseDown(true);
    setMovingBrush(true);
    setCurrentBrush(brush);
  };

  const handleOnDrag = <T extends SVGGElement>(
    event: React.MouseEvent<T, MouseEvent>,
    brush: Brush
  ) => {
    if (!mouseDown) return;

    let [X1, X2, Y1, Y2] = [
      brush.extents.x1 * width,
      brush.extents.x2 * width,
      brush.extents.y1 * height,
      brush.extents.y2 * height
    ];

    let [delX1, delX2, delY1, delY2] = [
      event.movementX,
      event.movementX,
      event.movementY,
      event.movementY
    ];

    if (X1 + delX1 <= 0 || X2 + delX2 >= width) {
      delX1 = 0;
      delX2 = 0;
    }
    if (Y2 + delY2 >= height || Y1 + delY1 <= 0) {
      delY1 = 0;
      delY2 = 0;
    }

    brush.extents.x1 = (X1 + delX1) / width;
    brush.extents.x2 = (X2 + delX2) / width;
    brush.extents.y1 = (Y1 + delY1) / height;
    brush.extents.y2 = (Y2 + delY2) / height;

    brushes[brush.id] = brush;
    setBrushes({ ...brushes });
  };

  const handleDragStop = <T extends SVGElement>(
    event: React.MouseEvent<T, MouseEvent>
  ) => {
    const currentTarget = event.currentTarget.getBoundingClientRect();

    const curr = currentBrush;
    setMouseDown(false);
    setMovingBrush(false);
    setCurrentBrush(null as any);
    onBrushUpdate({ ...brushes }, curr, "Change", {
      x: event.clientX - currentTarget.left,
      y: event.clientY - currentTarget.top
    });
  };

  const removeAllBrushes = () => {
    const brs = JSON.parse(JSON.stringify(brushes));
    setBrushes({});
    onBrushUpdate({ ...brushes }, brs, "Clear");
  };

  if (!clearAllBrushSetup) {
    clearAllBrushSetup = (_: any) => {};
  }

  clearAllBrushSetup(removeAllBrushes);

  const removeBrush = (brush: Brush) => {
    delete brushes[brush.id];
    setBrushes({ ...brushes });
    onBrushUpdate({ ...brushes }, brush, "Remove");
  };

  const handleOnResizeStart = <T extends SVGGElement>(
    _: React.MouseEvent<T, MouseEvent>,
    brush: Brush,
    resizeDirection: BrushResizeType
  ) => {
    setMouseDownForResize(true);
    setCurrentBrush(brush);
    setResizeDirection(resizeDirection);
  };

  const handleOnResize = <T extends SVGGElement>(
    event: React.MouseEvent<T, MouseEvent>,
    brush: Brush
  ) => {
    if (!mouseDownForResize) return;
    switch (BrushResizeType[resizeDirection]) {
      case BrushResizeType.LEFT:
        brush.extents.x1 += event.movementX / width;
        break;
      case BrushResizeType.RIGHT:
        brush.extents.x2 += event.movementX / width;
        break;
      case BrushResizeType.TOP:
        brush.extents.y1 += event.movementY / height;
        break;
      case BrushResizeType.BOTTOM:
        brush.extents.y2 += event.movementY / height;
        break;
      case BrushResizeType.TOPLEFT:
        brush.extents.x1 += event.movementX / width;
        brush.extents.y1 += event.movementY / height;
        break;
      case BrushResizeType.TOPRIGHT:
        brush.extents.x2 += event.movementX / width;
        brush.extents.y1 += event.movementY / height;
        break;
      case BrushResizeType.BOTTOMLEFT:
        brush.extents.x1 += event.movementX / width;
        brush.extents.y2 += event.movementY / height;
        break;
      case BrushResizeType.BOTTOMRIGHT:
        brush.extents.x2 += event.movementX / width;
        brush.extents.y2 += event.movementY / height;
        break;
      default:
        console.log(event.movementX, event.movementY);
    }

    brushes[brush.id] = brush;
    setBrushes({ ...brushes });
  };

  const handleOnResizeEnd = <T extends SVGGElement>(
    event: React.MouseEvent<T, MouseEvent>
  ) => {
    const currentTarget = event.currentTarget.getBoundingClientRect();

    const curr = currentBrush;
    setMouseDownForResize(false);

    setCurrentBrush(null as any);
    setResizeDirection(null as any);
    onBrushUpdate({ ...brushes }, curr, `Change`, {
      x: event.clientX - currentTarget.left,
      y: event.clientY - currentTarget.top
    });
  };

  const brushOverlay = (
    <rect
      ref={layerRef}
      height={height}
      width={width}
      fill="none"
      cursor="crosshair"
      stroke={showBrushBorder ? "black" : "none"}
      pointerEvents={switchOff ? "none" : "all"}
      onMouseDown={handleMouseDownWhenCreating}
      onMouseMove={event => {
        if (isCreatingNewBrush) {
          handleMouseMoveWhenCreating(event);
        }
        if (movingBrush) {
          handleOnDrag(event, currentBrush);
        }
        if (mouseDownForResize) {
          handleOnResize(event, currentBrush);
        }
      }}
      onMouseUp={event => {
        if (isCreatingNewBrush) handleMouseUpWhenCreating(event);
        if (movingBrush) handleDragStop(event);
        if (mouseDownForResize) handleOnResizeEnd(event);
      }}
      onMouseLeave={event => {
        if (isCreatingNewBrush) handleMouseUpWhenCreating(event);
        if (movingBrush) handleDragStop(event);
        if (mouseDownForResize) handleOnResizeEnd(event);
      }}
    />
  );

  let brushKeys = Object.keys(brushes);
  if (currentBrush && currentBrush.id) {
    brushKeys = [
      ...brushKeys.filter(b => b !== currentBrush.id),
      currentBrush.id
    ];
  }

  const brushGroup = (
    <g ref={brushGroupRef} className="brushGroup">
      {brushKeys.map(brushKey => {
        const brush = brushes[brushKey];
        let { x1, y1, x2, y2 } = brush.extents;
        x1 = x1 * width;
        x2 = x2 * width;
        y1 *= height;
        y2 *= height;
        if (x2 < x1 && y2 < y1)
          return (
            <SingleBrushComponent
              key={brush.id}
              x1={x2}
              y1={y2}
              x2={x1}
              y2={y1}
              brush={brush}
              onDragStart={handleDragStart}
              removeBrush={removeBrush}
              onResizeStart={handleOnResizeStart}
              onResize={handleOnResize}
              onResizeEnd={handleOnResizeEnd}
            />
          );
        if (x2 < x1)
          return (
            <SingleBrushComponent
              key={brush.id}
              x1={x2}
              y1={y1}
              x2={x1}
              y2={y2}
              brush={brush}
              onDragStart={handleDragStart}
              removeBrush={removeBrush}
              onResizeStart={handleOnResizeStart}
              onResize={handleOnResize}
              onResizeEnd={handleOnResizeEnd}
            />
          );
        if (y2 < y1)
          return (
            <SingleBrushComponent
              key={brush.id}
              x1={x1}
              y1={y2}
              x2={x2}
              y2={y1}
              brush={brush}
              onDragStart={handleDragStart}
              removeBrush={removeBrush}
              onResizeStart={handleOnResizeStart}
              onResize={handleOnResize}
              onResizeEnd={handleOnResizeEnd}
            />
          );
        return (
          <SingleBrushComponent
            key={brush.id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            brush={brush}
            onDragStart={handleDragStart}
            removeBrush={removeBrush}
            onResizeStart={handleOnResizeStart}
            onResize={handleOnResize}
            onResizeEnd={handleOnResizeEnd}
          />
        );
      })}
    </g>
  );

  const [first, second] =
    isCreatingNewBrush || movingBrush || mouseDownForResize
      ? [brushGroup, brushOverlay]
      : [brushOverlay, brushGroup];

  return (
    <g transform={`translate(${left - extentPadding}, ${top - extentPadding})`}>
      {first}
      {second}
    </g>
  );
};

export default BrushComponent;
