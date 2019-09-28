import React, {FC, useRef, useState} from 'react';

import {Brush, BrushCollection, BrushAffectType} from '../Types/Brush';
import {BrushableRegion} from '../Types/BrushableRegion';
import {BrushResizeType} from '../Types/BrushResizeEnum';
import SingleBrushComponent from './SingleBrushComponent';

interface Props {
  extents: BrushableRegion;
  showBrushBorder?: boolean;
  onBrushUpdate: (
    brushes: BrushCollection,
    affectedBrush: Brush,
    affectType: BrushAffectType,
  ) => void;
}

const BrushComponent: FC<Props> = ({
  extents,
  showBrushBorder,
  onBrushUpdate,
}: Props) => {
  const {top, left, right, bottom} = extents;
  const [height, width] = [Math.abs(bottom - top), Math.abs(left - right)];

  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [brushes, setBrushes] = useState<BrushCollection>({});
  const [currentBrush, setCurrentBrush] = useState<Brush>(null as any);
  const [isCreatingNewBrush, setIsCreatingNewBrush] = useState<boolean>(false);
  const [movingBrush, setMovingBrush] = useState<boolean>(false);
  const [mouseDownForResize, setMouseDownForResize] = useState<boolean>(false);
  const [resizeDirection, setResizeDirection] = useState<BrushResizeType>(
    null as any,
  );
  const brushGroupRef = useRef<SVGGElement>(null);

  const handleMouseDownWhenCreating = <T extends SVGElement>(
    event: React.MouseEvent<T, MouseEvent>,
  ) => {
    setMouseDown(true);
    const currentTarget = event.currentTarget.getBoundingClientRect();
    const brush: Brush = {
      id: new Date().getTime().toString(),
      extents: {
        x1: event.clientX - currentTarget.left,
        x2: event.clientX - currentTarget.left,
        y1: event.clientY - currentTarget.top,
        y2: event.clientY - currentTarget.top,
      },
    };
    brushes[brush.id] = brush;

    setCurrentBrush(brush);
    setBrushes({...brushes});
    setIsCreatingNewBrush(true);
  };

  const handleMouseMoveWhenCreating = <T extends SVGGElement>(
    event: React.MouseEvent<T, MouseEvent>,
  ) => {
    if (!mouseDown) return;
    const currentTarget = event.currentTarget.getBoundingClientRect();
    let x1 = currentBrush.extents.x1;
    let y1 = currentBrush.extents.y1;
    let x2 = event.clientX - currentTarget.left;
    let y2 = event.clientY - currentTarget.top;

    currentBrush.extents = {x1, x2, y1, y2};

    brushes[currentBrush.id] = currentBrush;
    setBrushes({...brushes});
  };

  const handleMouseUpWhenCreating = <T extends {}>(
    _: React.MouseEvent<T, MouseEvent>,
  ) => {
    if (
      currentBrush.extents &&
      (currentBrush.extents.x1 === currentBrush.extents.x2 ||
        currentBrush.extents.y1 === currentBrush.extents.y2)
    ) {
      delete brushes[currentBrush.id];
    }
    const curr = currentBrush;
    let {x1, x2, y1, y2} = curr.extents;

    if (x1 > x2) [x1, x2] = [x2, x1];
    if (y1 > y2) [y1, y2] = [y2, y1];

    curr.extents = {x1, x2, y1, y2};
    brushes[curr.id] = curr;
    setCurrentBrush(null as any);
    setMouseDown(false);
    setIsCreatingNewBrush(false);
    onBrushUpdate({...brushes}, curr, BrushAffectType.ADD);
  };

  const handleDragStart = <T extends SVGElement>(
    _: React.MouseEvent<T, MouseEvent>,
    brush: Brush,
  ) => {
    setMouseDown(true);
    setMovingBrush(true);
    setCurrentBrush(brush);
  };

  const handleOnDrag = <T extends SVGGElement>(
    event: React.MouseEvent<T, MouseEvent>,
    brush: Brush,
  ) => {
    if (!mouseDown) return;

    let [X1, X2, Y1, Y2] = [
      brush.extents.x1,
      brush.extents.x2,
      brush.extents.y1,
      brush.extents.y2,
    ];

    let [delX1, delX2, delY1, delY2] = [
      event.movementX,
      event.movementX,
      event.movementY,
      event.movementY,
    ];

    if (X1 + delX1 <= 0 || X2 + delX2 >= width) {
      delX1 = 0;
      delX2 = 0;
    }
    if (Y2 + delY2 >= height || Y1 + delY1 <= 0) {
      delY1 = 0;
      delY2 = 0;
    }

    brush.extents.x1 = X1 + delX1;
    brush.extents.x2 = X2 + delX2;
    brush.extents.y1 = Y1 + delY1;
    brush.extents.y2 = Y2 + delY2;

    brushes[brush.id] = brush;
    setBrushes({...brushes});
  };

  const handleDragStop = <T extends {}>(_: React.MouseEvent<T, MouseEvent>) => {
    const curr = currentBrush;
    setMouseDown(false);
    setMovingBrush(false);
    setCurrentBrush(null as any);
    onBrushUpdate({...brushes}, curr, BrushAffectType.CHANGE);
  };

  const removeBrush = (brush: Brush) => {
    delete brushes[brush.id];
    setBrushes({...brushes});
    onBrushUpdate({...brushes}, brush, BrushAffectType.REMOVE);
  };

  const handleOnResizeStart = <T extends SVGGElement>(
    _: React.MouseEvent<T, MouseEvent>,
    brush: Brush,
    resizeDirection: BrushResizeType,
  ) => {
    setMouseDownForResize(true);
    setCurrentBrush(brush);
    setResizeDirection(resizeDirection);
  };

  const handleOnResize = <T extends SVGGElement>(
    event: React.MouseEvent<T, MouseEvent>,
    brush: Brush,
  ) => {
    if (!mouseDownForResize) return;
    switch (BrushResizeType[resizeDirection]) {
      case BrushResizeType.LEFT:
        brush.extents.x1 += event.movementX;
        break;
      case BrushResizeType.RIGHT:
        brush.extents.x2 += event.movementX;
        break;
      case BrushResizeType.TOP:
        brush.extents.y1 += event.movementY;
        break;
      case BrushResizeType.BOTTOM:
        brush.extents.y2 += event.movementY;
        break;
      case BrushResizeType.TOPLEFT:
        brush.extents.x1 += event.movementX;
        brush.extents.y1 += event.movementY;
        break;
      case BrushResizeType.TOPRIGHT:
        brush.extents.x2 += event.movementX;
        brush.extents.y1 += event.movementY;
        break;
      case BrushResizeType.BOTTOMLEFT:
        brush.extents.x1 += event.movementX;
        brush.extents.y2 += event.movementY;
        break;
      case BrushResizeType.BOTTOMRIGHT:
        brush.extents.x2 += event.movementX;
        brush.extents.y2 += event.movementY;
        break;
      default:
        console.log(event.movementX, event.movementY);
    }

    brushes[brush.id] = brush;
    setBrushes({...brushes});
  };

  const handleOnResizeEnd = <T extends SVGGElement>(
    _: React.MouseEvent<T, MouseEvent>,
  ) => {
    const curr = currentBrush;
    setMouseDownForResize(false);

    setCurrentBrush(null as any);
    setResizeDirection(null as any);
    onBrushUpdate({...brushes}, curr, BrushAffectType.CHANGE);
  };

  const brushOverlay = (
    <rect
      height={height}
      width={width}
      fill="none"
      cursor="crosshair"
      stroke={showBrushBorder ? 'black' : 'none'}
      pointerEvents="all"
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
      currentBrush.id,
    ];
  }

  const brushGroup = (
    <g ref={brushGroupRef} className="brushGroup">
      {brushKeys.map(brushKey => {
        const brush = brushes[brushKey];
        const {x1, y1, x2, y2} = brush.extents;

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
    <g transform={`translate(${left}, ${top})`}>
      {first}
      {second}
    </g>
  );
};

export default BrushComponent;
