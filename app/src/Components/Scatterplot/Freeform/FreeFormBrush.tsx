import React, {FC, createRef, useReducer, useContext} from 'react';
import IntentStore from '../../../Store/IntentStore';
import {inject, observer} from 'mobx-react';
import {BrushableRegion} from '../../Brush/Types/BrushableRegion';
import translate from '../../../Utils/Translate';
import {select} from 'd3';
import {FreeFromRadiusContext} from '../Scatterplot';
import {style} from 'typestyle';

type BrushStartHandler = () => void;
type BrushMoveHandler = (x: number, y: number, radius: number) => void;
type BrushEndHandler = () => void;

type Props = {
  store?: IntentStore;
  extents: BrushableRegion;
  extentPadding?: number;
  onBrushStart?: BrushStartHandler;
  onBrush?: BrushMoveHandler;
  onBrushEnd?: BrushEndHandler;
};

type LocalState = typeof initialState;

const initialState = {
  mouseDown: false,
  mousePosition: {
    x: -1,
    y: -1,
  },
};

type Action =
  | {type: 'mousedown'; mouseDown: boolean}
  | {type: 'mouseposition'; mousePosition: {x: number; y: number}}
  | {type: 'all'; mouseDown: boolean; mousePosition: {x: number; y: number}};

function reducer(state: LocalState, action: Action): LocalState {
  switch (action.type) {
    case 'mousedown':
      const {mouseDown} = action;
      return {...state, mouseDown};
    case 'mouseposition':
      const {mousePosition} = action;
      return {...state, mousePosition};
    case 'all':
      const {mouseDown: md, mousePosition: mp} = action;
      return {mouseDown: md, mousePosition: mp};
    default:
      throw new Error('Lol');
  }
}

const FreeFormBrush: FC<Props> = ({
  extents,
  extentPadding = 0,
  onBrushStart,
  onBrush,
  onBrushEnd,
}: Props) => {
  const brushRef = createRef<SVGCircleElement>();
  const {left = 0, right = 0, top = 0, bottom = 0} = extents;

  const radius = useContext(FreeFromRadiusContext);

  const [{mouseDown, mousePosition}, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const [height, width] = [
    Math.abs(bottom + extentPadding - (top - extentPadding)),
    Math.abs(left - extentPadding - (right + extentPadding)),
  ];

  function handleMouseDown(
    event: React.MouseEvent<SVGCircleElement, MouseEvent>,
  ) {
    const target = event.currentTarget.getBoundingClientRect();
    const [x, y] = [event.clientX - target.left, event.clientY - target.top];

    dispatch({
      type: 'all',
      mouseDown: true,
      mousePosition: {
        x,
        y,
      },
    });

    if (onBrushStart) {
      onBrushStart();
    }
  }

  function handleMouseUpAndLeave() {
    dispatch({
      type: 'all',
      mouseDown: false,
      mousePosition: {
        x: -1,
        y: -1,
      },
    });

    if (onBrushEnd) {
      onBrushEnd();
    }
  }

  function handleMove(event: React.MouseEvent<SVGCircleElement, MouseEvent>) {
    const node = brushRef.current;
    if (node) {
      const target = event.currentTarget.getBoundingClientRect();
      const [x, y] = [event.clientX - target.left, event.clientY - target.top];
      select(node)
        .attr('cx', x)
        .attr('cy', y);
      if (onBrush) {
        onBrush(x, y, radius);
      }
    }
  }

  return (
    <g
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUpAndLeave}
      onMouseLeave={handleMouseUpAndLeave}
      onMouseMove={handleMove}
      transform={translate(-extentPadding, -extentPadding)}>
      <rect fill="none" pointerEvents="all" width={width} height={height} />
      {mouseDown && (
        <circle
          className={brushStyle}
          pointerEvents={mouseDown ? 'all' : 'initial'}
          ref={brushRef}
          opacity="0.3"
          fill="blue"
          r={radius}
          cx={mousePosition.x}
          cy={mousePosition.y}
        />
      )}
    </g>
  );
};

export default inject('store')(observer(FreeFormBrush));

const brushStyle = style({
  cursor: 'grabbing',
});
