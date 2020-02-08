import React, {FC} from 'react';
import translate from '../Utils/translate';
import {treeColor} from './Styles';
import {Animate} from 'react-move';
import {ProvenanceNode} from './ProvVis';

interface BackboneNodeProps {
  first: boolean;
  current: boolean;
  duration: number;
  node: ProvenanceNode<unknown>;
  radius: number;
  strokeWidth: number;
  textSize: number;
}

const BackboneNode: FC<BackboneNodeProps> = ({
  first,
  current,
  node,
  duration,
  radius,
  strokeWidth,
  textSize,
}: BackboneNodeProps) => {
  const padding = 15;

  return (
    <Animate
      start={{opacity: 0}}
      enter={{
        opacity: [1],
        timing: {duration: 100, delay: first ? 0 : duration},
      }}>
      {state => (
        <>
          <circle
            className={treeColor(current)}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <g style={{opacity: state.opacity}} transform={translate(padding, 0)}>
            <Label
              label={node.label}
              dominantBaseline="middle"
              textAnchor="start"
              fontSize={textSize}
              fontWeight={current ? 'bold' : 'regular'}
            />
          </g>
        </>
      )}
    </Animate>
  );
};

export default BackboneNode;

const Label: FC<{label: string} & React.SVGProps<SVGTextElement>> = (props: {
  label: string;
}) => {
  return <text {...props}>{props.label}</text>;
};
