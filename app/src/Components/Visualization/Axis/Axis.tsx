import * as React from "react";

import {
  ScaleLinear,
  axisBottom,
  axisLeft,
  axisRight,
  axisTop,
  select
} from "d3";
import { useEffect, useState } from "react";

import styled from "styled-components";

export enum ScaleType {
  BOTTOM,
  TOP,
  LEFT,
  RIGHT
}

interface Props {
  scale: ScaleLinear<number, number>;
  position: ScaleType;
  label?: string;
  size?: number;
}

const Axis: React.FC<Props> = ({ scale, position, label, size }) => {
  const ref: React.RefObject<SVGGElement> = React.createRef();
  const [axisDim, setAxisDim] = useState(0);

  if (!size) size = 2;

  let axis: any;
  let xTranslate: number = axisDim;
  let yTranslate: number = axisDim;

  switch (position) {
    case ScaleType.BOTTOM:
      xTranslate = scale.range()[1] / 2;
      axis = axisBottom(scale);
      break;
    case ScaleType.TOP:
      xTranslate = scale.range()[1] / 2;
      axis = axisTop(scale);
      break;
    case ScaleType.LEFT:
      yTranslate = scale.range()[1] / 2;
      axis = axisLeft(scale);
      break;
    case ScaleType.RIGHT:
      yTranslate = scale.range()[1] / 2;
      axis = axisRight(scale);
      break;
    default:
      axis = axisBottom(scale);
  }

  useEffect(() => {
    const gElement = ref.current as any;
    select(ref.current).call(axis);

    switch (position) {
      case ScaleType.BOTTOM:
        setAxisDim(gElement.getBoundingClientRect().height);
        break;
      case ScaleType.TOP:
        setAxisDim(-gElement.getBoundingClientRect().height);
        break;
      case ScaleType.LEFT:
        setAxisDim(-gElement.getBoundingClientRect().width);
        break;
      case ScaleType.RIGHT:
        setAxisDim(gElement.getBoundingClientRect().width);
        break;
      default:
        setAxisDim(gElement.getBoundingClientRect().height);
        break;
    }
  }, [scale, axis, position, ref]);

  return (
    <g>
      <g ref={ref} />
      {position === ScaleType.LEFT || position === ScaleType.RIGHT ? (
        <LabelTextY
          size={size}
          right={position === ScaleType.RIGHT}
          transform={`translate(${xTranslate}, ${yTranslate})`}
        >
          {label}
        </LabelTextY>
      ) : (
        <LabelTextX
          size={size}
          top={position === ScaleType.TOP}
          transform={`translate(${xTranslate}, ${yTranslate})`}
        >
          {label}
        </LabelTextX>
      )}
    </g>
  );
};

export default Axis;

interface LabelTextXProps {
  size: number;
  top: boolean;
}

const LabelTextX = styled.text<LabelTextXProps>`
  font-size: ${props => props.size}em;
  text-anchor: middle;
  dominant-baseline: ${props => (props.top ? "baseline" : "hanging")};
`;

interface LabelTextYProps {
  size: number;
  right: boolean;
}

const LabelTextY = styled.text<LabelTextYProps>`
  font-size: ${props => props.size}em;
  text-anchor: middle;
  writing-mode: vertical-rl;
  text-gravity: inverse;
  dominant-baseline: ${props => (props.right ? "middle" : "hanging")};
`;
