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
import styles from './scatterplotmatrix.module.css';
import SPMComponent from './SPMComponent';

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
    brushBehavior: MultiBrushBehavior
  ) => void;
  addChangeAxisInteraction: (
    dimensions: string[],
    brushBehavior: MultiBrushBehavior
  ) => void;
}
interface StateProps {
  brushBehavior: MultiBrushBehavior;
}

interface OwnProps {
  data: any[];
  dimensions: string[];
  labelColumn: string;
  debugIndices: number[];
  debugColumns: string[];
  debugShowSelected: boolean;
  debugSelectedPoints: number[];
}

type Props = OwnProps & DispatchProps & StateProps;

class ScatterPlotMatrix extends React.Component<Props, State> {
  ref: React.RefObject<SVGSVGElement> = React.createRef();
  divRef: React.RefObject<HTMLDivElement> = React.createRef();

  readonly state: State = {
    svgHeight: 0,
    svgWidth: 0,
    selectedDimensions: [],
    brushDict: {},
    pointSelection: []
  };

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
    this.props.addEmptyInteraction(dims, this.props.brushBehavior);
  }

  componentWillMount() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  resize() {
    const divHeight = (this.divRef.current as HTMLDivElement).clientHeight;
    const divWidth = (this.divRef.current as HTMLDivElement).clientWidth;
    const lesser = divHeight < divWidth ? divHeight : divWidth;

    select(this.divRef.current)
      .style("height", `${lesser}px`)
      .style("width", `${lesser}px`);

    this.setState({
      svgHeight: lesser,
      svgWidth: lesser
    });
  }

  updateSelection = (selectedDimensions: string[]) => {
    this.setState({ selectedDimensions });
    console.log("Hello");
    this.props.addChangeAxisInteraction(
      selectedDimensions,
      this.props.brushBehavior
    );
  };

  updateBrushDict = (brushDict: BrushDictionary) => {
    this.setState({ brushDict });
  };

  updatePointSelection = (pointSelection: number[]) => {
    this.setState({ pointSelection });
  };

  render() {
    const { dimensions, data, labelColumn } = this.props;
    const { selectedDimensions, svgHeight, svgWidth, brushDict } = this.state;

    const labels = data.map(r => r[labelColumn]);

    const lesserDim = svgHeight > svgWidth ? svgWidth : svgHeight;
    return (
      <ScatterPlotDiv>
        <DimensionSelector
          label="X Axis"
          dimensions={dimensions}
          selection={selectedDimensions}
          disabledDimensions={[]}
          notifyColumnChange={(col: string) => {
            let selDims: any[] = [];
            if (selectedDimensions.includes(col))
              selDims = selectedDimensions.filter(d => d !== col);
            else selDims = [...selectedDimensions, col];

            this.updateSelection(selDims);
          }}
          debugBackend={this.props.debugColumns}
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
        <div ref={this.divRef} className={styles.square}>
          <FullSizeSVG ref={this.ref}>
            <g transform={`translate(50,50)`}>
              <SPMComponent
                vis={VisualizationType.ScatterPlotMatrix}
                data={data}
                height={lesserDim - 100}
                width={lesserDim - 100}
                labels={labels}
                columns={selectedDimensions}
                XZero={false}
                YZero={false}
                brushDict={brushDict}
                updateBrushDictionary={this.updateBrushDict}
                pointSelection={this.state.pointSelection}
                updatePointSelection={this.updatePointSelection}
                debugIndices={this.props.debugIndices}
                debugShowSelected={this.props.debugShowSelected}
                debugSelectedPoints={this.props.debugSelectedPoints}
              />
            </g>
          </FullSizeSVG>
        </div>
      </ScatterPlotDiv>
    );
  }
}

const mapStateToProps = (state: VisualizationState): StateProps => ({
  brushBehavior: state.mutliBrushBehavior
});

const mapDispatchToProps = (
  dispatch: Dispatch<InteractionHistoryAction>
): DispatchProps => ({
  addEmptyInteraction: (
    dimensions: string[],
    brushBehavior: MultiBrushBehavior
  ) => {
    dispatch({
      type: InteractionHistoryActions.ADD_INTERACTION,
      args: {
        multiBrushBehavior: brushBehavior,
        interaction: {
          visualizationType: VisualizationType.ScatterPlotMatrix,
          interactionType: {
            dimensions: dimensions
          }
        }
      }
    });
  },
  addChangeAxisInteraction: (
    dimensions: string[],
    brushBehavior: MultiBrushBehavior
  ) => {
    dispatch({
      type: InteractionHistoryActions.ADD_INTERACTION,
      args: {
        multiBrushBehavior: brushBehavior,
        interaction: {
          visualizationType: VisualizationType.ScatterPlotMatrix,
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
)(ScatterPlotMatrix);

const ScatterPlotDiv = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 0.75fr 14.25fr;
`;
