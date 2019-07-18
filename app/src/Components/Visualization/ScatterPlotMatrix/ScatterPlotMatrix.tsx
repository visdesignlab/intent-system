import React from "react";
import styled from "styled-components";
import DimensionSelector from "../../DimensionSelector/DimensionSelector";

interface State {
  svgHeight: number;
  svgWidth: number;
  selectedDimensions: string[];
}

interface DispatchProps {}
interface StateProps {}

interface OwnProps {
  data: any[];
  dimensions: string[];
  labelColumn: string;
}

type Props = OwnProps & DispatchProps & StateProps;

class ScatterPlotMatrix extends React.Component<Props, State> {
  readonly state: State = {
    svgHeight: 0,
    svgWidth: 0,
    selectedDimensions: []
  };

  componentDidMount() {
    const { dimensions } = this.props;

    this.setState({
      selectedDimensions: dimensions.slice(0, 3)
    });
  }

  updateSelection = (selectedDimensions: string[]) => {
    this.setState({ selectedDimensions });
  };

  render() {
    const { dimensions } = this.props;
    const { selectedDimensions } = this.state;

    return (
      <ScatterPlotDiv>
        <DimensionSelector
          label="X Axis"
          dimensions={dimensions}
          selection={selectedDimensions}
          disabledDimensions={[]}
          notifyColumnChange={(col: string) => {
            if (selectedDimensions.includes(col))
              return selectedDimensions.filter(d => d !== col);
            else return [...selectedDimensions, col];
          }}
        />
      </ScatterPlotDiv>
    );
  }
}

export default ScatterPlotMatrix;

const ScatterPlotDiv = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 15fr;
`;
