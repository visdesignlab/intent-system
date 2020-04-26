import { isStateNode, NodeID } from '@visdesignlab/provenance-lib-core';
import { inject, observer } from 'mobx-react';
import React, { FC, memo, useContext, useEffect, useRef, useState } from 'react';
import { Divider, Header, Radio } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ActionContext } from '../Contexts';
import ProvVis from '../ProvVis/components/ProvVis';
import { Bundle, BundleMap } from '../ProvVis/Utils/BundleMap';
import { EventConfig } from '../ProvVis/Utils/EventConfig';
import translate from '../ProvVis/Utils/translate';
import IntentStore from '../Store/IntentStore';
import { IntentEvents } from '../Store/Provenance';
import {
  AddBrush,
  AddPlot,
  ChangeBrush,
  ChangeBrushSize,
  ChangeBrushType,
  ChangeCategory,
  ClearAll,
  Invert,
  LoadDataset,
  LockPrediction,
  MultiBrush,
  PointDeselection,
  PointSelection,
  RemoveBrush,
  SwitchCategoryVisibility,
  TurnPrediction,
} from './Icons';

interface Props {
  store?: IntentStore;
}

const ProvenanceVisualization: FC<Props> = ({ store }: Props) => {
  const { graph } = store!;
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const [visMode, setVisMode] = useState<"label" | "icon">("label");

  const actions = useContext(ActionContext);

  useEffect(() => {
    const current = ref.current;
    if (current && dimensions.width === 0 && dimensions.height === 0) {
      setDimensions({
        height: current.clientHeight,
        width: current.clientWidth,
      });
    }
  }, [dimensions]);

  const { width, height } = dimensions;

  const fauxRoot = Object.values(graph.nodes).find((d) =>
    d.label.includes("Load Dataset")
  );

  const eventConfig: EventConfig<IntentEvents> = {
    "Load Dataset": {
      backboneGlyph: <LoadDataset size={22} />,
      currentGlyph: <LoadDataset size={22} fill={"#2185d0"} />,
      regularGlyph: <LoadDataset size={16} />,
      bundleGlyph: <LoadDataset size={22} fill={"#2185d0"} />,
    },
    MultiBrush: {
      backboneGlyph: <MultiBrush size={22} />,
      currentGlyph: <MultiBrush size={22} fill={"#2185d0"} />,
      regularGlyph: <MultiBrush size={16} />,
      bundleGlyph: <MultiBrush size={22} fill={"#2185d0"} />,
    },
    "Switch Category Visibility": {
      backboneGlyph: <SwitchCategoryVisibility size={22} />,
      currentGlyph: <SwitchCategoryVisibility size={22} fill={"#2185d0"} />,
      regularGlyph: <SwitchCategoryVisibility size={16} />,
      bundleGlyph: <SwitchCategoryVisibility size={22} fill={"#2185d0"} />,
    },
    "Change Category": {
      backboneGlyph: <ChangeCategory size={22} />,
      currentGlyph: <ChangeCategory size={22} fill={"#2185d0"} />,
      regularGlyph: <ChangeCategory size={16} />,
      bundleGlyph: <ChangeCategory size={22} fill={"#2185d0"} />,
    },
    "Add Plot": {
      backboneGlyph: <AddPlot size={22} />,
      currentGlyph: <AddPlot size={22} fill={"#2185d0"} />,
      regularGlyph: <AddPlot size={16} />,
      bundleGlyph: <AddPlot size={22} fill={"#2185d0"} />,
    },
    "Point Selection": {
      backboneGlyph: <PointSelection size={22} />,
      currentGlyph: <PointSelection size={22} fill={"#2185d0"} />,
      regularGlyph: <PointSelection size={16} />,
      bundleGlyph: <PointSelection size={22} fill={"#2185d0"} />,
    },
    "Point Deselection": {
      backboneGlyph: <PointDeselection size={22} />,
      currentGlyph: <PointDeselection size={22} fill={"#2185d0"} />,
      regularGlyph: <PointDeselection size={16} />,
      bundleGlyph: <PointDeselection size={22} fill={"#2185d0"} />,
    },
    "Add Brush": {
      backboneGlyph: <AddBrush size={22} />,
      currentGlyph: <AddBrush size={22} fill={"#2185d0"} />,
      regularGlyph: <AddBrush size={16} />,
      bundleGlyph: <AddBrush size={22} fill={"#2185d0"} />,
    },
    "Lock Prediction": {
      backboneGlyph: <LockPrediction size={22} />,
      currentGlyph: <LockPrediction size={22} fill={"#2185d0"} />,
      regularGlyph: <LockPrediction size={16} />,
      bundleGlyph: <LockPrediction size={22} fill={"rgb(248, 191, 132)"} />,
    },
    "Turn Prediction": {
      backboneGlyph: <TurnPrediction size={22} />,
      currentGlyph: <TurnPrediction size={22} fill={"#2185d0"} />,
      regularGlyph: <TurnPrediction size={16} />,
      bundleGlyph: <TurnPrediction size={22} fill={"#2185d0"} />,
    },
    Invert: {
      backboneGlyph: <Invert size={22} />,
      currentGlyph: <Invert size={22} fill={"#2185d0"} />,
      regularGlyph: <Invert size={16} />,
      bundleGlyph: <Invert size={22} fill={"#2185d0"} />,
    },
    "Change Brush": {
      backboneGlyph: <ChangeBrush size={22} />,
      currentGlyph: <ChangeBrush size={22} fill={"#2185d0"} />,
      regularGlyph: <ChangeBrush size={16} />,
      bundleGlyph: <ChangeBrush size={22} fill={"#2185d0"} />,
    },
    "Remove Brush": {
      backboneGlyph: <RemoveBrush size={22} />,
      currentGlyph: <RemoveBrush size={22} fill={"#2185d0"} />,
      regularGlyph: <RemoveBrush size={16} />,
      bundleGlyph: <RemoveBrush size={22} fill={"#2185d0"} />,
    },
    "Clear All": {
      backboneGlyph: <ClearAll size={22} />,
      currentGlyph: <ClearAll size={22} fill={"#2185d0"} />,
      regularGlyph: <ClearAll size={16} />,
      bundleGlyph: <ClearAll size={22} fill={"#ccc"} />,
    },
    "Change Brush Type": {
      backboneGlyph: <ChangeBrushType size={22} />,
      currentGlyph: <ChangeBrushType size={22} fill={"#2185d0"} />,
      regularGlyph: <ChangeBrushType size={16} />,
      bundleGlyph: <ChangeBrushType size={22} fill={"#2185d0"} />,
    },
    "Change Brush Size": {
      backboneGlyph: <ChangeBrushSize size={22} />,
      currentGlyph: <ChangeBrushSize size={22} fill={"#2185d0"} />,
      regularGlyph: <ChangeBrushSize size={16} />,
      bundleGlyph: <ChangeBrushSize size={22} fill={"#2185d0"} />,
    },
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
    //
    // // let annotation = "";
    if (node.artifacts.extra.length > 0) {
      let styles4 = {
        fontWeight: "bold",
        marginBottom: 0,
        marginTop: 0,
        padding: 0,
      } as React.CSSProperties;

      let styles5 = {
        fontWeight: "normal",
        marginBottom: 0,
        marginTop: 0,
        padding: 0,
      } as React.CSSProperties;

      return (
        <div>
          <h4 style={styles4}>{node.label}</h4>
          <h5 style={styles5}>
            {node.artifacts.extra[node.artifacts.extra.length - 1].e.annotation}
          </h5>
        </div>
      );
    }

    return <h4>{node.label}</h4>;
  };

  const lockedNodes = Object.values(graph.nodes)
    .filter(
      (d) =>
        d.metadata.type === "Lock Prediction" || d.metadata.type === "Clear All"
    )
    .map((d) => d.id);

  const map: BundleMap = {};

  lockedNodes.forEach((node) => {
    const bundle: Bundle = {
      metadata: null,
      bundleLabel: "Locked Prediction",
      bunchedNodes: [],
    };

    const toBunch: string[] = [];

    toBunch.push(node);
    let testNode: string = node;
    while (true) {
      const currNode = graph.nodes[testNode];
      if (isStateNode(currNode)) {
        const parent = graph.nodes[currNode.parent];
        if (
          parent.metadata.type === "Add Plot" ||
          parent.metadata.type === "Lock Prediction" ||
          parent.metadata.type === "Clear All" ||
          parent.children.length > 1
        ) {
          break;
        }

        toBunch.push(parent.id);
        testNode = parent.id;
      } else break;
    }
    bundle.bunchedNodes = toBunch.reverse();
    map[node] = bundle;
  });

  let divStyle = {
    overflowY: "auto",
  } as React.CSSProperties;

  return (
    <div style={divStyle} ref={ref} className={provStyle}>
      <Header as="h3">History</Header>
      <Radio
        toggle
        label="Show Labels"
        checked={visMode === "label"}
        onChange={() => {
          if (visMode === "label") setVisMode("icon");
          else setVisMode("label");
        }}
      />
      <Divider />
      {dimensions.width && dimensions.height && (
        <ProvVis
          graph={graph}
          iconOnly={visMode === "icon"}
          root={fauxRoot ? fauxRoot.id : graph.root}
          current={graph.current}
          nodeMap={graph.nodes}
          width={width}
          gutter={20}
          backboneGutter={25}
          sideOffset={200}
          height={height * 0.9}
          verticalSpace={45}
          clusterVerticalSpace={45}
          textSize={12}
          changeCurrent={(id: NodeID) => actions.goToNode(id)}
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
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  $nest: {
    svg: {
      $nest: {
        rect: {
          opacity: 0.2,
        },
      },
    },
  },
});
