import React, { FC, memo, useEffect, useRef, useState } from 'react';

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

type MousePosition = { x: number; y: number };

type State = {
  mouseDown: boolean;
  brushes: BrushCollection;
  currentBrushId: string;
  isCreatingNewBrush: boolean;
  movingBrush: boolean;
  mouseDownForResize: boolean;
  resizeDirection: BrushResizeType;
  mouseDiff: { diffX: number; diffY: number } | null;
};

const defaultState: State = {
  mouseDown: false,
  brushes: {},
  currentBrushId: "",
  isCreatingNewBrush: false,
  movingBrush: false,
  mouseDownForResize: false,
  resizeDirection: null as any,
  mouseDiff: null
};

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

  // Desctructure elements
  const { top, left, right, bottom } = extents;
  const [height, width] = [
    Math.abs(bottom + extentPadding - (top - extentPadding)),
    Math.abs(left - extentPadding - (right + extentPadding))
  ];

  // Stringify
  const initialBrushString = JSON.stringify(initialBrushes);

  // Refs
  const layerRef = useRef<SVGRectElement>(null);
  const brushGroupRef = useRef<SVGGElement>(null);

  // State hooks
  const [state, setState] = useState<State>(defaultState);
  const {
    mouseDown,
    brushes,
    currentBrushId,
    isCreatingNewBrush,
    movingBrush,
    mouseDownForResize,
    resizeDirection,
    mouseDiff = { diffX: 0, diffY: 0 }
  } = JSON.parse(JSON.stringify(state)) as State;

  function setStateEff(st: State) {
    if (JSON.stringify(st) !== JSON.stringify(state)) {
      setState(JSON.parse(JSON.stringify(st)));
    }
  }

  function manageBrush(brush: Brush) {
    let { x1, x2, y1, y2 } = brush.extents;

    if (x2 < x1 && y2 < y1) {
      [x1, x2] = [x2, x1];
      [y1, y2] = [y2, y1];
    }

    if (x2 < x1) {
      [x1, x2] = [x2, x1];
    }

    if (y2 < y1) {
      [y1, y2] = [y2, y1];
    }

    brush.extents = { x1, x2, y1, y2 };

    return brush;
  }

  // Effect Hooks
  useEffect(() => {
    const initialBrushes = JSON.parse(initialBrushString);
    if (initialBrushes) {
      setState(s => {
        if (initialBrushString !== JSON.stringify(s.brushes))
          return { ...s, brushes: initialBrushes };
        return s;
      });
    }
  }, [initialBrushString]);

  function handleMouseDownWhenCreating<T extends SVGElement>(
    event: React.MouseEvent<T, MouseEvent>
  ) {
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

    setStateEff({
      ...state,
      mouseDown: true,
      currentBrushId: brush.id,
      brushes: { ...JSON.parse(JSON.stringify(brushes)) },
      isCreatingNewBrush: true
    });
  }

  function handleMouseMoveWhenCreating(event: MouseEvent) {
    if (!mouseDown) return;
    const targetNode = layerRef.current;
    if (targetNode) {
      const currentBrush = brushes[currentBrushId];
      const target = targetNode.getBoundingClientRect();
      let x1 = currentBrush.extents.x1;
      let y1 = currentBrush.extents.y1;
      let x2 = (event.clientX - target.left) / width;
      let y2 = (event.clientY - target.top) / height;

      if (x2 * width < 0 || x2 * width > width) {
        x2 = currentBrush.extents.x2;
      }
      if (y2 * height < 0 || y2 * height > height) {
        y2 = currentBrush.extents.y2;
      }

      currentBrush.extents = { x1, x2, y1, y2 };
      brushes[currentBrush.id] = currentBrush;
      setStateEff({ ...state, brushes: JSON.parse(JSON.stringify(brushes)) });
    }
  }

  function handleMouseUpWhenCreating(event: MouseEvent) {
    const currentTargetNode = layerRef.current;
    if (currentTargetNode) {
      const currentTarget = currentTargetNode.getBoundingClientRect();
      const currentBrush = brushes[currentBrushId];
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

      setStateEff({
        ...state,
        currentBrushId: "",
        mouseDown: false,
        isCreatingNewBrush: false
      });
    }
  }

  function handleDragStart<T extends SVGElement>(
    event: React.MouseEvent<T, MouseEvent>,
    brush: Brush,
    ref: SVGRectElement
  ) {
    const targetNode = layerRef.current;
    if (!targetNode) return;

    const target = targetNode.getBoundingClientRect();
    const [x, y] = [event.clientX - target.left, event.clientY - target.top];

    const [diffX, diffY] = [
      Math.abs(brush.extents.x1 * width - x),
      Math.abs(brush.extents.y1 * width - y)
    ];
    setStateEff({
      ...state,
      mouseDown: true,
      movingBrush: true,
      currentBrushId: brush.id,
      mouseDiff: { diffX, diffY }
    });
  }

  function handleOnDrag(event: MouseEvent, currentBrushId: string) {
    if (!mouseDown) return;

    const brush = brushes[currentBrushId];

    const targetNode = layerRef.current;
    if (!targetNode) return;

    const target = targetNode.getBoundingClientRect();
    const { diffX = 0, diffY = 0 } = mouseDiff || {};

    const [newX, newY] = [
      event.clientX - target.left - diffX,
      event.clientY - target.top - diffY
    ];

    let [X1, X2, Y1, Y2] = [
      brush.extents.x1 * width,
      brush.extents.x2 * width,
      brush.extents.y1 * height,
      brush.extents.y2 * height
    ];

    const brushWidth = X2 - X1;
    const brushHeight = Y2 - Y1;

    [X1, X2, Y1, Y2] = [newX, newX + brushWidth, newY, newY + brushHeight];

    if (X1 <= 0 || X2 >= width) {
      X1 = brush.extents.x1 * width;
      X2 = brush.extents.x2 * width;
    }

    if (Y1 <= 0 || Y2 >= height) {
      Y1 = brush.extents.y1 * height;
      Y2 = brush.extents.y2 * height;
    }

    brush.extents.x1 = X1 / width;
    brush.extents.x2 = X2 / width;
    brush.extents.y1 = Y1 / height;
    brush.extents.y2 = Y2 / height;

    brushes[brush.id] = brush;
    setStateEff({ ...state, brushes });
  }

  function handleDragStop<T extends SVGElement>(
    event: React.MouseEvent<T, MouseEvent>
  ) {
    const targetNode = layerRef.current;
    if (!targetNode) return;
    const currentTarget = targetNode.getBoundingClientRect();
    const curr = brushes[currentBrushId];

    setState({
      ...state,
      mouseDown: false,
      movingBrush: false,
      currentBrushId: "",
      mouseDiff: null
    });
    onBrushUpdate({ ...brushes }, curr, "Change", {
      x: event.clientX - currentTarget.left,
      y: event.clientY - currentTarget.top
    });
  }

  function removeAllBrushes() {
    const brs = JSON.parse(JSON.stringify(brushes));
    setStateEff({ ...state, brushes: {} });
    onBrushUpdate({ ...brushes }, brs, "Clear");
  }

  if (!clearAllBrushSetup) {
    clearAllBrushSetup = (_: any) => {};
  }

  clearAllBrushSetup(removeAllBrushes);

  function removeBrush(brush: Brush) {
    delete brushes[brush.id];
    setStateEff({ ...state, brushes });
    onBrushUpdate({ ...brushes }, brush, "Remove");
  }

  function handleOnResizeStart<T extends SVGGElement>(
    event: React.MouseEvent<T, MouseEvent>,
    currentBrush: Brush,
    resizeDirection: BrushResizeType
  ) {
    const targetNode = layerRef.current;
    if (!targetNode) return;
    const brush = brushes[currentBrush.id];
    const target = targetNode.getBoundingClientRect();
    const [x, y] = [event.clientX - target.left, event.clientY - target.top];

    const [diffX, diffY] = [
      Math.abs(brush.extents.x1 * width - x),
      Math.abs(brush.extents.y1 * width - y)
    ];

    setStateEff({
      ...state,
      mouseDownForResize: true,
      currentBrushId: brush.id,
      resizeDirection,
      mouseDiff: { diffX, diffY }
    });
  }

  function handleOnResize(event: MouseEvent, currentBrushId: string) {
    if (!mouseDownForResize) return;

    const brush = brushes[currentBrushId];

    let [X1, X2, Y1, Y2] = [
      brush.extents.x1,
      brush.extents.x2,
      brush.extents.y1,
      brush.extents.y2
    ];

    switch (BrushResizeType[resizeDirection]) {
      case BrushResizeType.LEFT:
        X1 += event.movementX / width;
        break;
      case BrushResizeType.RIGHT:
        X2 += event.movementX / width;
        break;
      case BrushResizeType.TOP:
        Y1 += event.movementY / height;
        break;
      case BrushResizeType.BOTTOM:
        Y2 += event.movementY / height;
        break;
      case BrushResizeType.TOPLEFT:
        X1 += event.movementX / width;
        Y1 += event.movementY / height;
        break;
      case BrushResizeType.TOPRIGHT:
        X2 += event.movementX / width;
        Y1 += event.movementY / height;
        break;
      case BrushResizeType.BOTTOMLEFT:
        X1 += event.movementX / width;
        Y2 += event.movementY / height;
        break;
      case BrushResizeType.BOTTOMRIGHT:
        X2 += event.movementX / width;
        Y2 += event.movementY / height;
        break;
      default:
        console.log(event.movementX, event.movementY);
    }

    [X1, X2, Y1, Y2] = [X1 * width, X2 * width, Y1 * height, Y2 * height];

    if (X1 <= 0 || X2 >= width || X1 >= width || X2 <= 0) {
      X1 = brush.extents.x1 * width;
      X2 = brush.extents.x2 * width;
    }
    if (Y1 <= 0 || Y2 >= height || Y2 <= 0 || Y1 >= height) {
      Y1 = brush.extents.y1 * height;
      Y2 = brush.extents.y2 * height;
    }

    brush.extents = {
      x1: X1 / width,
      x2: X2 / width,
      y1: Y1 / height,
      y2: Y2 / height
    };
    brushes[brush.id] = brush;
    setStateEff({ ...state, brushes });
  }

  function handleOnResizeEnd<T extends SVGGElement>(
    event: React.MouseEvent<T, MouseEvent>
  ) {
    const targetNode = layerRef.current;
    if (!targetNode) return;
    const currentTarget = targetNode.getBoundingClientRect();
    let curr = brushes[currentBrushId];
    curr = manageBrush(curr);
    brushes[curr.id] = curr;

    setStateEff({
      ...state,
      brushes,
      mouseDownForResize: false,
      currentBrushId: "",
      resizeDirection: null as any,
      mouseDiff: null
    });
    onBrushUpdate({ ...brushes }, curr, `Change`, {
      x: event.clientX - currentTarget.left,
      y: event.clientY - currentTarget.top
    });
  }

  let brushKeys = Object.keys(brushes);
  if (currentBrushId !== "") {
    brushKeys = [
      ...brushKeys.filter(b => b !== currentBrushId),
      currentBrushId
    ];
  }

  function handleMove(event: MouseEvent) {
    if (isCreatingNewBrush) {
      handleMouseMoveWhenCreating(event as any);
    }
    if (movingBrush) {
      handleOnDrag(event as any, currentBrushId);
    }
    if (mouseDownForResize) {
      handleOnResize(event as any, currentBrushId);
    }
  }

  function handleMouseUp(event: MouseEvent) {
    if (isCreatingNewBrush) handleMouseUpWhenCreating(event as any);
    if (movingBrush) handleDragStop(event as any);
    if (mouseDownForResize) handleOnResizeEnd(event as any);
  }

  function addEvents() {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function removeEvents() {
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  useEffect(() => {
    addEvents();
    return removeEvents;
  });

  // Components
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
    />
  );

  const brushGroup = (
    <g ref={brushGroupRef} className="brushGroup">
      {brushKeys.map(brushKey => {
        const brush = brushes[brushKey];
        let { x1, y1, x2, y2 } = JSON.parse(JSON.stringify(brush.extents));
        x1 = x1 * width;
        x2 = x2 * width;
        y1 *= height;
        y2 *= height;

        if (x2 < x1 && y2 < y1) {
          [x1, x2] = [x2, x1];
          [y1, y2] = [y2, y1];
        }

        if (x2 < x1) {
          [x1, x2] = [x2, x1];
        }

        if (y2 < y1) {
          [y1, y2] = [y2, y1];
        }

        // console.log({ prev, curr: { x1, x2, y1, y2 } });

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
            onResize={() => {}}
            onResizeEnd={() => {}}
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

(BrushComponent as any).whyDidYouRender = true;
export default memo(BrushComponent);
