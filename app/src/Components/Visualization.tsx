import React, {FC} from 'react';
import styled from 'styled-components';

interface OwnProps {
  test?: string;
}

type Props = OwnProps;

const Visualization: FC<Props> = ({}: Props) => {
  return (
    <MainSvg>
      <g transform={'translate(50, 50)'}>
        <text>Test</text>
      </g>
    </MainSvg>
  );
};

export default Visualization;

const MainSvg = styled('svg')`
  width: 100%;
  height: 100%;
`;
