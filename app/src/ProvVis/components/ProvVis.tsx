import React, { useState, useEffect, ReactChild } from "react";
import "semantic-ui-css/semantic.min.css";
import {
  ProvenanceGraph,
  NodeID,
  Nodes,
  ProvenanceNode,
  isStateNode,
  StateNode
} from "@visdesignlab/provenance-lib-core";
import { stratify, HierarchyNode } from "d3";
import { treeLayout } from "../Utils/TreeLayout";
import findBundleParent from "../Utils/findBundleParent";

import translate from "../Utils/translate";
import { NodeGroup } from "react-move";
import BackboneNode from "./BackboneNode";
import Link from "./Link";
import { treeColor } from "./Styles";
import nodeTransitions from "./NodeTransitions";
import linkTransitions from "./LinkTransitions";
import bundleTransitions from "./BundleTransitions";

import { style } from "typestyle";
import { EventConfig } from "../Utils/EventConfig";
import { BundleMap } from "../Utils/BundleMap";
import { Popup } from "semantic-ui-react";

interface ProvVisProps<T, S extends string, A> {
  graph: ProvenanceGraph<T, S, A>;
  root: NodeID;
  sideOffset?: number;
  iconOnly?:boolean;
  current: NodeID;
  nodeMap: Nodes<T, S, A>;
  changeCurrent?: (id: NodeID) => void;
  backboneGutter?: number;
  gutter?: number;
  verticalSpace?: number;
  annotationHeight?: number;
  clusterVerticalSpace?: number;
  regularCircleRadius?: number;
  backboneCircleRadius?: number;
  regularCircleStroke?: number;
  backboneCircleStroke?: number;
  topOffset?: number;
  textSize?: number;
  height?: number;
  width?: number;
  linkWidth?: number;
  duration?: number;
  clusterLabels?: boolean;
  bundleMap?: BundleMap;
  eventConfig?: EventConfig<S>;
  popupContent?: (nodeId: StateNode<T, S, A>) => ReactChild;
  annotationContent?: (nodeId: StateNode<T, S, A>) => ReactChild;
}

export type StratifiedMap<T, S, A> = {
  [key: string]: HierarchyNode<ProvenanceNode<T, S, A>>;
};
export type StratifiedList<T, S, A> = HierarchyNode<ProvenanceNode<T, S, A>>[];

function ProvVis<T, S extends string, A>({
  nodeMap,
  width = 1500,
  height = 2000,
  root,
  current,
  changeCurrent,
  iconOnly=false,
  gutter = 15,
  backboneGutter = 20,
  verticalSpace = 50,
  annotationHeight = 100,
  clusterVerticalSpace = 50,
  regularCircleRadius = 4,
  backboneCircleRadius = 5,
  regularCircleStroke = 3,
  backboneCircleStroke = 3,
  sideOffset = 200,
  topOffset = 30,
  textSize = 15,
  linkWidth = 4,
  duration = 600,
  clusterLabels = true,
  bundleMap,
  eventConfig,
  popupContent,
  annotationContent
}: ProvVisProps<T, S, A>) {
  const [first, setFirst] = useState(true);
  const [annotationOpen, setAnnotationOpen] = useState(-1);
  const [expandedClusterList, setExpandedClusterList] = useState<string[]>([]);

  useEffect(() => {
    setFirst(false);
  }, []);

  let nodeList = Object.values(nodeMap).filter(
    d => d.metadata.createdOn! >= nodeMap[root].metadata.createdOn!
  );

  let copyList = Array.from(nodeList);

  const keys = bundleMap ? Object.keys(bundleMap) : [];

  //Find a list of all nodes included in a bundle.
  let bundledNodes: string[] = [];

  if (bundleMap) {
    for (let key of keys) {
      bundledNodes = bundledNodes.concat(bundleMap[key].bunchedNodes);
      bundledNodes.push(key);
    }
  }

  const strat = stratify<ProvenanceNode<T, S, A>>()
    .id(d => d.id)
    .parentId(d => {
      if (d.id === root) return null;
      if (isStateNode(d)) {
        if (
          bundleMap &&
          Object.keys(bundleMap).includes(d.id) &&
          !expandedClusterList.includes(d.id)
        ) {
          let curr = d;

          while (true) {
            if (!bundledNodes.includes(curr.parent) || Object.keys(bundleMap).includes(curr.parent)) {
              return curr.parent;
            }

            let temp = copyList.filter(d => {
              return d.id === curr.parent;
            })[0];

            if (isStateNode(temp)) {
              curr = temp;
            }
          }
        }

        let bundleParent = findBundleParent(d.parent, bundleMap);

        if (
          bundledNodes.includes(d.parent) &&
          bundleMap &&
          !Object.keys(bundleMap).includes(d.parent) &&
          !expandedClusterList.includes(bundleParent)
        ) {
          return bundleParent;
        }
        return d.parent;
      } else {
        return null;
      }
    });


  for (let i = 0; i < nodeList.length; i++) {
    if (
      bundledNodes.includes(nodeList[i].id) &&
      !expandedClusterList.includes(
        findBundleParent(nodeList[i].id, bundleMap)
      ) &&
      bundleMap &&
      !Object.keys(bundleMap).includes(nodeList[i].id)
    ) {
      nodeList.splice(i, 1);
      i--;
    }
  }

  const stratifiedTree = strat(nodeList);
  const stratifiedList: StratifiedList<T, S, A> = stratifiedTree.descendants();
  const stratifiedMap: StratifiedMap<T, S, A> = {};

  stratifiedList.forEach(c => (stratifiedMap[c.id!] = c));
  treeLayout(stratifiedMap, current, root);

  const links = stratifiedTree.links();

  const xOffset = gutter;
  const yOffset = verticalSpace;

  function regularGlyph(node: ProvenanceNode<T, S, A>) {
    if (eventConfig) {
      const eventType = node.metadata.type;
      if (
        eventType &&
        eventType in eventConfig &&
        eventType !== "Root" &&
        eventConfig[eventType].regularGlyph
      ) {
        return eventConfig[eventType].regularGlyph;
      }
    }
    return (
      <circle
        r={regularCircleRadius}
        strokeWidth={regularCircleStroke}
        className={treeColor(false)}
      />
    );
  }

  function bundleGlyph(node: ProvenanceNode<T, S, A>) {
    if (eventConfig) {
      const eventType = node.metadata.type;
      if (eventType && eventType in eventConfig && eventType !== "Root") {
        return eventConfig[eventType].bundleGlyph;
      }
    }
    return (
      <circle
        r={regularCircleRadius}
        strokeWidth={regularCircleStroke}
        className={treeColor(false)}
      />
    );
  }

  let maxHeight = (stratifiedList[0].height * verticalSpace)
  return (
    <div className={container} id="prov-vis">
      <svg height={(maxHeight < height) ? height : maxHeight} width={width}>
        <rect height={height} width={width} fill="none" stroke="black" />
        <g transform={translate(width - sideOffset, topOffset)}>

          <NodeGroup
            data={links}
            keyAccessor={link => `${link.source.id}${link.target.id}`}
            {...linkTransitions(
              xOffset,
              yOffset,
              clusterVerticalSpace,
              backboneGutter - gutter,
              duration,
              stratifiedList,
              stratifiedMap,
              annotationOpen,
              annotationHeight,
              bundleMap
            )}
          >
            {linkArr => (
              <>
                {linkArr.map(link => {
                  const { key, state } = link;

                  return (
                    <g key={key}>
                      <Link
                        {...state}
                        className={treeColor(true)}
                        strokeWidth={linkWidth}
                      />
                    </g>
                  );
                })}
              </>
            )}
          </NodeGroup>
          <NodeGroup
            data={stratifiedList}
            keyAccessor={d => d.id}
            {...nodeTransitions(
              xOffset,
              yOffset,
              clusterVerticalSpace,
              backboneGutter - gutter,
              duration,
              stratifiedList,
              stratifiedMap,
              annotationOpen,
              annotationHeight,
              bundleMap
            )}
          >
            {nodes => {
              return (
                <>
                  {nodes.map(node => {
                    const { data: d, key, state } = node;
                    const popupTrigger = (
                      <g
                        key={key}
                        onClick={() => {
                          if (changeCurrent) {
                            changeCurrent(d.id);
                          }
                        }}
                        transform={
                          d.width === 0
                            ? translate(state.x, state.y)
                            : translate(state.x, state.y)
                        }
                      >
                        {d.width === 0 ? (
                          <BackboneNode
                            textSize={textSize}
                            iconOnly={iconOnly}
                            radius={backboneCircleRadius}
                            strokeWidth={backboneCircleStroke}
                            duration={duration}
                            first={first}
                            current={current === d.id}
                            node={d.data}
                            bundleMap={bundleMap}
                            nodeMap={stratifiedMap}
                            clusterLabels={clusterLabels}
                            annotationOpen={annotationOpen}
                            setAnnotationOpen={setAnnotationOpen}
                            exemptList={expandedClusterList}
                            setExemptList={setExpandedClusterList}
                            eventConfig={eventConfig}
                            annotationContent={annotationContent}
                            popupContent={popupContent}
                            expandedClusterList={expandedClusterList}
                          />
                        ) : popupContent !== undefined ? (
                          <Popup
                            content={popupContent(d.data)}
                            trigger={
                              <g
                                onClick={() => {
                                  setAnnotationOpen(-1);
                                }}
                              >
                                {keys.includes(d.id)
                                  ? bundleGlyph(d.data)
                                  : regularGlyph(d.data)}
                              </g>
                            }
                          />
                        ) : (
                          <g
                            onClick={() => {
                              setAnnotationOpen(-1);
                            }}
                          >
                            {regularGlyph(d.data)}
                          </g>
                        )}
                      </g>
                    );

                    return popupTrigger;
                  })}
                </>
              );
            }}
          </NodeGroup>
          <NodeGroup
            data={keys}
            keyAccessor={key => `${key}`}
            {...bundleTransitions(
              xOffset,
              verticalSpace,
              clusterVerticalSpace,
              backboneGutter - gutter,
              duration,
              expandedClusterList,
              stratifiedMap,
              stratifiedList,
              annotationOpen,
              annotationHeight,
              bundleMap
            )}
          >
            {bundle => (
              <>
                {bundle.map(b => {
                  const { key, state } = b;
                  if (
                    bundleMap === undefined ||
                    (stratifiedMap[b.key] as any).width !== 0 ||
                    state.validity === false
                  ) {
                    return null;
                  }

                  return (
                    <g
                      key={key}
                      transform={translate(
                        state.x - gutter + 5,
                        state.y - clusterVerticalSpace / 2
                      )}
                    >
                      <rect
                        style={{opacity:state.opacity}}
                        width={iconOnly ? 42 : sideOffset - 15}
                        height={state.height}
                        rx="10"
                        ry="10"
                        fill="none"
                        strokeWidth="2px"
                        stroke="rgb(248, 191, 132)"
                      ></rect>
                    </g>
                  );
                })}
              </>
            )}
          </NodeGroup>
        </g>
      </svg>
    </div>
  );
}

export default ProvVis;

const container = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "auto"
});
