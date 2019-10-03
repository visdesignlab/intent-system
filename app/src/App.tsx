import React, {FC} from 'react';
import styled from 'styled-components';

interface OwnProps {}

type Props = OwnProps;

const App: FC<Props> = ({}: Props) => {
  return <MainDiv>Hello</MainDiv>;
};

export default App;

const MainDiv = styled('div')`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-areas: 'visualization predictions_study';
  height: 100vh;
  width: 100vw;
`;
