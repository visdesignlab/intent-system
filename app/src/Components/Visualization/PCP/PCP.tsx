import { MultiBrushBehavior, VisualizationType } from '@visdesignlab/intent-contract';
import { select } from 'd3';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Dropdown, Segment } from 'semantic-ui-react';
import styled from 'styled-components';

import { changeDataset, datasets } from '../../..';
import { InteractionHistoryAction, InteractionHistoryActions } from '../../../App/VisStore/InteractionHistoryReducer';
import { VisualizationState } from '../../../App/VisStore/VisualizationState';
import DimensionSelector from '../../DimensionSelector/DimensionSelector';
import { BrushDictionary } from '../Data Types/BrushType';
import FullSizeSVG from '../ReusableComponents/FullSizeSVG';
import PCPComponent from './PCPComponent';

interface State {
  svgHeight: number;
  svgWidth: number;
  selectedDimensions: string[];
  brushDict: BrushDictionary;
  pointSelection: number[];
}
interface DispatchProps {
  addEmptyInteraction: (
    dimensions: string[],
    multiBrushBehavior: MultiBrushBehavior
  ) => void;
  addChangeAxisInteraction: (
    dimensions: string[],
    multiBrushBehavior: MultiBrushBehavior
  ) => void;
}

interface StateProps {
  multiBrushBehavior: MultiBrushBehavior;
}

interface OwnProps {
  data: any[];
  dimensions: string[];
  labelColumn: string;
}

type Props = OwnProps & StateProps & DispatchProps;

class PCP extends React.Component<Props, State> {
  ref: React.RefObject<SVGSVGElement> = React.createRef();
  divRef: React.RefObject<HTMLDivElement> = React.createRef();

  readonly state: State = {
    svgHeight: 0,
    svgWidth: 0,
    selectedDimensions: [],
    brushDict: {},
    pointSelection: []
  };

  constructor(props: Props) {
    super(props);
    // window.addEventListener("resize", this.resize.bind(this));
  }

  componentDidMount() {
    const { dimensions } = this.props;

    const divHeight = (this.divRef.current as HTMLDivElement).clientHeight;
    const divWidth = (this.divRef.current as HTMLDivElement).clientWidth;

    const lesser = divHeight < divWidth ? divHeight : divWidth;

    select(this.divRef.current)
      .style("height", `${lesser}px`)
      .style("width", `${lesser}px`);

    const dims = dimensions.slice(0, 3);

    this.setState({
      svgHeight: lesser,
      svgWidth: lesser,
      selectedDimensions: dims
    });
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.resize.bind(this));
  }

  updateSelection = (selectedDimensions: string[]) => {
    this.setState({ selectedDimensions });
    // this.props.addChangeAxisInteraction(
    //   selectedDimensions,
    // )
  };

  render() {
    const { dimensions } = this.props;
    const { selectedDimensions } = this.state;

    return (
      <ScatterPlotDiv>
        <DimensionSelector
          label="Dimensions"
          dimensions={dimensions}
          selection={selectedDimensions}
          disabledDimensions={[]}
          notifyColumnChange={(col: string) => {
            let selDims: string[] = [];
            if (selectedDimensions.includes(col))
              selDims = selectedDimensions.filter(d => d !== col);
            else selDims = [...selectedDimensions, col];
            this.updateSelection(selDims);
          }}
          debugBackend={[]}
        />
        <Segment>
          <Dropdown
            placeholder="Change Dataset"
            selection
            options={datasets.map(k => ({
              key: k,
              text: k,
              value: k
            }))}
            onChange={(e, data) => {
              changeDataset(data.value as string);
            }}
          />
        </Segment>

        <div ref={this.divRef}>
          <FullSizeSVG ref={this.ref}>
            <g transform={`translate(50,50)`}>
              <PCPComponent></PCPComponent>
            </g>
          </FullSizeSVG>
        </div>
      </ScatterPlotDiv>
    );
  }
}

const ScatterPlotDiv = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 0.75fr 14.5fr;
`;

const mapStateToProps = (state: VisualizationState): StateProps => ({
  multiBrushBehavior: state.mutliBrushBehavior
});

const mapDispatchToProps = (
  dispatch: Dispatch<InteractionHistoryAction>
): DispatchProps => ({
  addEmptyInteraction: (
    dimensions: string[],
    multiBrushBehavior: MultiBrushBehavior
  ) => {
    dispatch({
      type: InteractionHistoryActions.ADD_INTERACTION,
      args: {
        multiBrushBehavior: multiBrushBehavior,
        interaction: {
          visualizationType: VisualizationType.ParallelCoordinatePlot,
          interactionType: {
            dimensions: dimensions
          }
        }
      }
    });
  },
  addChangeAxisInteraction: (
    dimensions: string[],
    multiBrushBehavior: MultiBrushBehavior
  ) => {
    dispatch({
      type: InteractionHistoryActions.ADD_INTERACTION,
      args: {
        multiBrushBehavior: multiBrushBehavior,
        interaction: {
          visualizationType: VisualizationType.ParallelCoordinatePlot,
          interactionType: {
            dimensions: dimensions
          }
        }
      }
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PCP);
