import React, {
  FC,
  useRef,
  useState,
  useEffect,
  memo,
  useContext
} from "react";
import { inject, observer } from "mobx-react";
import IntentStore from "../Store/IntentStore";
import { style } from "typestyle";
import { NodeID, isStateNode } from "@visdesignlab/provenance-lib-core";
import ProvVis from "../ProvVis/components/ProvVis";
import translate from "../ProvVis/Utils/translate";
import { EventConfig } from '../ProvVis/Utils/EventConfig';
import { IntentEvents } from '../Store/Provenance';
import { ActionContext } from "../Contexts";
import { BundleMap, Bundle } from "../ProvVis/Utils/BundleMap";
import { ChangeBrushSize,
  ChangeBrushType,
  ClearAll,
  RemoveBrush,
  ChangeBrush,
  Invert,
  TurnPrediction,
  LockPrediction,
  AddBrush,
  PointDeselection,
  PointSelection,
  AddPlot,
  LoadDataset,
  MultiBrush,
  SwitchCategoryVisibility,
  ChangeCategory
} from './Icons';


interface Props {
  store?: IntentStore;
}

const ProvenanceVisualization: FC<Props> = ({ store }: Props) => {
  const { graph } = store!;
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const actions = useContext(ActionContext);

  useEffect(() => {
    const current = ref.current;
    if (current && dimensions.width === 0 && dimensions.height === 0) {
      setDimensions({
        height: current.clientHeight,
        width: current.clientWidth
      });
    }
  }, [dimensions]);

  const { width, height } = dimensions;

  const fauxRoot = Object.values(graph.nodes).find(d =>
    d.label.includes("Load Dataset")
  );

  const eventConfig: EventConfig<IntentEvents> = {
    'Load Dataset': {
      backboneGlyph: <LoadDataset size={22}/>,
      currentGlyph: <LoadDataset size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <LoadDataset size={16}/>,
      bundleGlyph:  <LoadDataset size={22}fill={"cornflowerblue"}/>
    },
    'MultiBrush': {
      backboneGlyph: <MultiBrush size={22}/>,
      currentGlyph: <MultiBrush size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <MultiBrush size={16}/>,
      bundleGlyph: <MultiBrush size={22}fill={"cornflowerblue"}/>
    },
    'Switch Category Visibility': {
      backboneGlyph: <SwitchCategoryVisibility size={22}/>,
      currentGlyph: <SwitchCategoryVisibility size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <SwitchCategoryVisibility size={16}/>,
      bundleGlyph: <SwitchCategoryVisibility size={22}fill={"cornflowerblue"}/>
    },
    'Change Category': {
      backboneGlyph: <ChangeCategory size={22}/>,
      currentGlyph: <ChangeCategory size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <ChangeCategory size={16}/>,
      bundleGlyph: <ChangeCategory size={22}fill={"cornflowerblue"}/>
    },
    'Add Plot': {
      backboneGlyph: <AddPlot size={22}/>,
      currentGlyph: <AddPlot size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <AddPlot size={16}/>,
      bundleGlyph: <AddPlot size={22}fill={"cornflowerblue"}/>
    },
    'Point Selection': {
      backboneGlyph: <PointSelection size={22}/>,
      currentGlyph: <PointSelection size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <PointSelection size={16}/>,
      bundleGlyph: <PointSelection size={22}fill={"cornflowerblue"}/>
    },
    'Point Deselection': {
      backboneGlyph: <PointDeselection size={22}/>,
      currentGlyph: <PointDeselection size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <PointDeselection size={16}/>,
      bundleGlyph: <PointDeselection size={22}fill={"cornflowerblue"}/>
    },
    'Add Brush': {
      backboneGlyph: <AddBrush size={22}/>,
      currentGlyph: <AddBrush size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <AddBrush size={16}/>,
      bundleGlyph: <AddBrush size={22}fill={"cornflowerblue"}/>
    },
    'Lock Prediction': {
      backboneGlyph: <LockPrediction size={22}/>,
      currentGlyph: <LockPrediction size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <LockPrediction size={16}/>,
      bundleGlyph: <LockPrediction size={22}fill={"#39CCCC"}/>
    },
    'Turn Prediction': {
      backboneGlyph: <TurnPrediction size={22}/>,
      currentGlyph: <TurnPrediction size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <TurnPrediction size={16}/>,
      bundleGlyph: <TurnPrediction size={22}fill={"cornflowerblue"}/>
    },
    'Invert': {
      backboneGlyph: <Invert size={22}/>,
      currentGlyph: <Invert size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <Invert size={16}/>,
      bundleGlyph: <Invert size={22}fill={"cornflowerblue"}/>
    },
    'Change Brush': {
      backboneGlyph: <ChangeBrush size={22}/>,
      currentGlyph: <ChangeBrush size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <ChangeBrush size={16}/>,
      bundleGlyph: <ChangeBrush size={22}fill={"cornflowerblue"}/>
    },
    'Remove Brush': {
      backboneGlyph: <RemoveBrush size={22}/>,
      currentGlyph: <RemoveBrush size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <RemoveBrush size={16}/>,
      bundleGlyph: <RemoveBrush size={22}fill={"cornflowerblue"}/>
    },
    'Clear All': {
      backboneGlyph: <ClearAll size={22}/>,
      currentGlyph: <ClearAll size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <ClearAll size={16}/>,
      bundleGlyph: <ClearAll size={22}fill={"cornflowerblue"}/>
    },
    'Change Brush Type': {
      backboneGlyph: <ChangeBrushType size={22}/>,
      currentGlyph: <ChangeBrushType size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <ChangeBrushType size={16}/>,
      bundleGlyph: <ChangeBrushType size={22}fill={"cornflowerblue"}/>
    },
    'Change Brush Size': {
      backboneGlyph: <ChangeBrushSize size={22}/>,
      currentGlyph: <ChangeBrushSize size={22}fill={"cornflowerblue"}/>,
      regularGlyph: <ChangeBrushSize size={16}/>,
      bundleGlyph: <ChangeBrushSize size={22}fill={"steelgrey"}/>
    }
  };

  const annotationNode = (node: any) => {
    const { extra } = node.data.artifacts;
    let annotation = "";
    if (extra.length > 0) {
      annotation = extra[extra.length - 1].e.annotation;
    }

    return (
      <g transform={translate(0, 20)}>
        <text>{annotation}</text>
      </g>
    );
  };

  const popupNode = (node: any) => {
    // let annotation = "";
    // if (extra.length > 0) {
    //   annotation = extra[extra.length - 1].e.annotation;
    // }

    return (
      <h4>{node.label}</h4>
    );
  };


  const lockedNodes = Object.values(graph.nodes)
    .filter(d => d.label.includes("Lock"))
    .map(d => d.id);

  const map: BundleMap = {};

  lockedNodes.forEach(node => {
    const bundle: Bundle = {
      metadata: null,
      bundleLabel: "Locked Prediction",
      bunchedNodes: []
    };

    const toBunch: string[] = [];

    toBunch.push(node);
    let testNode: string = node;
    while (true) {
      const currNode = graph.nodes[testNode];
      if (isStateNode(currNode)) {
        const parent = graph.nodes[currNode.parent];
        toBunch.push(parent.id);
        testNode = parent.id;
        if (parent.label.includes("Add plot")) break;
      } else break;
    }
    bundle.bunchedNodes = toBunch.reverse();
    map[node] = bundle;
  });

  return (
    <div ref={ref} className={provStyle}>
      {dimensions.width && dimensions.height && (
        <ProvVis
          graph={graph}
          iconOnly={true}
          root={fauxRoot ? fauxRoot.id : graph.root}
          current={graph.current}
          nodeMap={graph.nodes}
          width={width}
          gutter={20}
          backboneGutter={25}
          sideOffset={width/4}
          height={height * 0.9}
          verticalSpace={45}
          textSize={12}
          changeCurrent={(id: NodeID) => actions.goToNode(id)}
          annotationHeight={50}
          annotationContent={annotationNode}
          popupContent={popupNode}
          bundleMap={map}
          eventConfig={eventConfig}
        />
      )}
    </div>
  );
};

(ProvenanceVisualization as any).whyDidYouRender = true;
export default memo(inject("store")(observer(ProvenanceVisualization)));

const provStyle = style({
  gridArea: "prov",
  paddingLeft: "1em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  $nest: {
    svg: {
      $nest: {
        rect: {
          opacity: 0.2
        }
      }
    }
  }
});
