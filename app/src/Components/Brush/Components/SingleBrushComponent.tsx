import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Brush } from '../Types/Brush';
import { BrushResizeType } from '../Types/BrushResizeEnum';

interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  brush: Brush;
  onDragStart: (
    event: React.MouseEvent<any, MouseEvent>,
    brush: Brush,
    ref: any
  ) => void;
  onResizeStart: (
    event: React.MouseEvent<any, MouseEvent>,
    brush: Brush,
    resizeDirection: BrushResizeType
  ) => void;
  onResize: (event: React.MouseEvent<any, MouseEvent>, brush: Brush) => void;
  onResizeEnd: (event: React.MouseEvent<any, MouseEvent>) => void;
  removeBrush: (brush: Brush) => void;
  resizeControlSize?: number;
}

function SingleBrushComponent({
  x1,
  x2,
  y1,
  y2,
  onDragStart,
  brush,
  removeBrush,
  resizeControlSize,
  onResizeStart,
  onResize,
  onResizeEnd
}: Props) {
  if (!resizeControlSize) {
    resizeControlSize = 7;
  }

  const brushRef = useRef<SVGRectElement>(null);

  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [timeoutClear, setTimeoutClear] = useState(-1);

  useEffect(() => {
    return () => {
      clearInterval(timeoutClear);
    };
  });

  // console.log({ x1, x2, y1, y2 });

  return (
    <>
      <BrushRectangle
        ref={brushRef}
        x={x1}
        y={y1}
        height={y2 - y1}
        width={x2 - x1}
        onMouseEnter={event => {
          clearInterval(timeoutClear);
          setShowCloseIcon(true);
        }}
        onMouseDown={event => onDragStart(event, brush, brushRef.current)}
        onMouseLeave={event => {
          const tout = setTimeout(() => {
            setShowCloseIcon(false);
          }, 900);
          setTimeoutClear(tout);
        }}
      />
      <HorizontalResizeRectangle
        x={x1 - resizeControlSize / 2}
        y={y1 + resizeControlSize / 2}
        height={y2 - y1 - resizeControlSize}
        width={resizeControlSize}
        onMouseDown={event => onResizeStart(event, brush, BrushResizeType.LEFT)}
        onMouseUp={event => onResizeEnd(event)}
      />
      <HorizontalResizeRectangle
        x={x2 - resizeControlSize / 2}
        y={y1 + resizeControlSize / 2}
        height={y2 - y1 - resizeControlSize}
        width={resizeControlSize}
        onMouseDown={event =>
          onResizeStart(event, brush, BrushResizeType.RIGHT)
        }
        onMouseUp={event => onResizeEnd(event)}
      />
      <VerticalResizeRectangle
        x={x1 + resizeControlSize / 2}
        y={y1 - resizeControlSize / 2}
        height={resizeControlSize}
        width={x2 - x1 - resizeControlSize}
        onMouseDown={event => onResizeStart(event, brush, BrushResizeType.TOP)}
        onMouseUp={event => onResizeEnd(event)}
      />
      <VerticalResizeRectangle
        x={x1 + resizeControlSize / 2}
        y={y2 - resizeControlSize / 2}
        height={resizeControlSize}
        width={x2 - x1 - resizeControlSize}
        onMouseDown={event =>
          onResizeStart(event, brush, BrushResizeType.BOTTOM)
        }
        onMouseUp={event => onResizeEnd(event)}
      />
      <TLBRResizeRectangle
        x={x1 - resizeControlSize / 2}
        y={y1 - resizeControlSize / 2}
        height={resizeControlSize}
        width={resizeControlSize}
        onMouseDown={event =>
          onResizeStart(event, brush, BrushResizeType.TOPLEFT)
        }
        onMouseUp={event => onResizeEnd(event)}
      />
      <TLBRResizeRectangle
        x={x2 - resizeControlSize / 2}
        y={y2 - resizeControlSize / 2}
        height={resizeControlSize}
        width={resizeControlSize}
        onMouseDown={event =>
          onResizeStart(event, brush, BrushResizeType.BOTTOMRIGHT)
        }
        onMouseUp={event => onResizeEnd(event)}
      />
      <TRBLResizeRectangle
        x={x2 - resizeControlSize / 2}
        y={y1 - resizeControlSize / 2}
        height={resizeControlSize}
        width={resizeControlSize}
        onMouseDown={event =>
          onResizeStart(event, brush, BrushResizeType.TOPRIGHT)
        }
        onMouseUp={event => onResizeEnd(event)}
      />
      <TRBLResizeRectangle
        x={x1 - resizeControlSize / 2}
        y={y2 - resizeControlSize / 2}
        height={resizeControlSize}
        width={resizeControlSize}
        onMouseDown={event =>
          onResizeStart(event, brush, BrushResizeType.BOTTOMLEFT)
        }
        onMouseUp={event => onResizeEnd(event)}
      />

      <g
        className="close-icon"
        transform={`translate(${x2 - 10}, ${y1 + 10})`}
        display={showCloseIcon ? "visible" : "none"}
      >
        <CloseIcon dominantBaseline="middle" textAnchor="middle">
          &#xf05e;
        </CloseIcon>
        <RemoveBrushCircle
          r="10"
          onClick={() => {
            removeBrush(brush);
          }}
        />
      </g>
    </>
  );
}

export default SingleBrushComponent;

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
