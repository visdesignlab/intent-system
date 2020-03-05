import React, {useState, useEffect, ReactChild} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  ProvenanceGraph,
  NodeID,
  Nodes,
  ProvenanceNode,
  isStateNode,
  StateNode,
} from '@visdesignlab/provenance-lib-core';
import {stratify, HierarchyNode} from 'd3';
import {treeLayout} from '../Utils/TreeLayout';
import translate from '../Utils/translate';
import {NodeGroup} from 'react-move';
import BackboneNode from './BackboneNode';
import Link from './Link';
import {treeColor} from './Styles';
import nodeTransitions from './NodeTransitions';
import linkTransitions from './LinkTransitions';
import bundleTransitions from './BundleTransitions';

import {style} from 'typestyle';
import {EventConfig} from '../Utils/EventConfig';
import {BundleMap} from '../Utils/BundleMap';
import {Popup} from 'semantic-ui-react';

interface ProvVisProps<T, S extends string, A> {
  graph: ProvenanceGraph<T, S, A>;
  root: NodeID;
  sideOffset?: number;
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
  gutter = 15,
  backboneGutter = 20,
  verticalSpace = 50,
  annotationHeight = 100,
  clusterVerticalSpace = 30,
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
  annotationContent,
}: ProvVisProps<T, S, A>) {
  const [first, setFirst] = useState(true);
  const [annotationOpen, setAnnotationOpen] = useState(-1);

  useEffect(() => {
    setFirst(false);
  }, []);

  const nodeList = Object.values(nodeMap).filter(
    d => d.metadata.createdOn! >= nodeMap[root].metadata.createdOn!,
  );

  const strat = stratify<ProvenanceNode<T, S, A>>()
    .id(d => d.id)
    .parentId(d => {
      if (d.id === root) return null;
      if (isStateNode(d)) {
        return d.parent;
      } else {
        return null;
      }
    });

  const keys = bundleMap ? Object.keys(bundleMap) : [];

  const stratifiedTree = strat(nodeList);
  const stratifiedList: StratifiedList<T, S, A> = stratifiedTree.descendants();
  const stratifiedMap: StratifiedMap<T, S, A> = {};

  // Find a list of all nodes included in a bundle.
  let bundledNodes: string[] = [];

  if (bundleMap) {
    for (let key of keys) {
      bundledNodes = bundledNodes.concat(bundleMap[key].bunchedNodes);
      bundledNodes.push(key);
    }
  }

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
        eventType !== 'Root' &&
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

  return (
    <div className={container} id="prov-vis">
      <svg height={height} width={width}>
        <rect height={height} width={width} fill="none" stroke="black" />
        <g transform={translate(width - sideOffset, topOffset)}>
          <NodeGroup
            data={keys}
            keyAccessor={key => `${key}`}
            {...bundleTransitions(
              xOffset,
              verticalSpace,
              clusterVerticalSpace,
              backboneGutter - gutter,
              duration,
              stratifiedMap,
              stratifiedList,
              annotationOpen,
              annotationHeight,
              bundleMap,
            )}>
            {bundle => (
              <>
                {bundle
                  .filter(b => {
                    const {state} = b;
                    return (
                      bundleMap === undefined ||
                      (stratifiedMap[b.key] as any).width !== 0 ||
                      state.validity === false
                    );
                  })
                  .map(b => {
                    const {key, state} = b;

                    return (
                      <g
                        key={key}
                        transform={translate(
                          state.x - gutter,
                          state.y - clusterVerticalSpace / 2,
                        )}>
                        <rect
                          width={sideOffset - gutter}
                          height={state.height}
                          rx="10"
                          ry="10"
                          fill="#F0F0F0"
                          stroke="none"></rect>
                      </g>
                    );
                  })}
              </>
            )}
          </NodeGroup>
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
              bundleMap,
            )}>
            {linkArr => (
              <>
                {linkArr.map(link => {
                  const {key, state} = link;

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
              bundleMap,
            )}>
            {nodes => {
              return (
                <>
                  {nodes.map(node => {
                    const {data: d, key, state} = node;
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
                        }>
                        {d.width === 0 ? (
                          <BackboneNode
                            textSize={textSize}
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
                            eventConfig={eventConfig}
                            annotationContent={annotationContent}
                            popupContent={popupContent}
                          />
                        ) : popupContent !== undefined ? (
                          <Popup
                            content={popupContent(d)}
                            trigger={
                              <g onClick={() => setAnnotationOpen(-1)}>
                                {regularGlyph(d.data)}
                              </g>
                            }
                          />
                        ) : (
                          <g onClick={() => setAnnotationOpen(-1)}>
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
        </g>
      </svg>
    </div>
  );
}

export default ProvVis;

const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'auto',
});
