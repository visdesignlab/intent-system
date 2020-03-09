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
import { ActionContext } from "../Contexts";
import { BundleMap, Bundle } from "../ProvVis/Utils/BundleMap";

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

  const lockedNodes = Object.values(graph.nodes)
    .filter(d => d.label.includes("Lock"))
    .map(d => d.id);

  console.log(lockedNodes);

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

  console.log(map);

  return (
    <div ref={ref} className={provStyle}>
      {dimensions.width && dimensions.height && (
        <ProvVis
          graph={graph}
          root={fauxRoot ? fauxRoot.id : graph.root}
          current={graph.current}
          nodeMap={graph.nodes}
          width={width}
          height={height * 0.9}
          verticalSpace={20}
          textSize={12}
          changeCurrent={(id: NodeID) => actions.goToNode(id)}
          annotationHeight={50}
          annotationContent={annotationNode}
          bundleMap={map}
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
