import React, {FC, useState, useEffect} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {stratify, HierarchyNode} from 'd3';
import {treeLayout} from '../Utils/TreeLayout';
import translate from '../Utils/translate';
import {NodeGroup} from 'react-move';
import BackboneNode from './BackboneNode';
import Link from './Link';
import {treeColor} from './Styles';
import nodeTransitions from './NodeTransitions';
import linkTransitions from './LinkTransitions';

export type NodeID = string;
export type ProvenanceGraph<T> = any;
export type Nodes<T> = {[key: string]: any};
export type ProvenanceNode<T> = any;
export const isStateNode = (d: any) => true;

interface ProvVisProps {
  graph: ProvenanceGraph<unknown>;
  root: string;
  height?: number;
  width?: number;
  sideOffset?: number;
  current: NodeID;
  nodeMap: Nodes<unknown>;
  changeCurrent: any;
  gutter?: number;
  backboneGutter?: number;
  verticalSpace?: number;
  regularCircleRadius?: number;
  backboneCircleRadius?: number;
  regularCircleStroke?: number;
  backboneCircleStroke?: number;
  topOffset?: number;
  textSize?: number;
}

export type StratifiedMap = {
  [key: string]: HierarchyNode<ProvenanceNode<unknown>>;
};
export type StratifiedList = HierarchyNode<ProvenanceNode<unknown>>[];

const ProvVis: FC<ProvVisProps> = ({
  nodeMap,
  width = 1500,
  height = 2000,
  root,
  current,
  changeCurrent,
  gutter = 15,
  backboneGutter = 20,
  verticalSpace = 50,
  regularCircleRadius = 4,
  backboneCircleRadius = 5,
  regularCircleStroke = 3,
  backboneCircleStroke = 3,
  sideOffset = 200,
  topOffset = 30,
  textSize = 15,
}: ProvVisProps) => {
  const [first, setFirst] = useState(true);

  useEffect(() => {
    setFirst(false);
  }, []);

  const nodeList = Object.values(nodeMap).filter(
    d => d.metadata.createdOn! >= nodeMap[root].metadata.createdOn!,
  );

  const strat = stratify<ProvenanceNode<unknown>>()
    .id(d => d.id)
    .parentId(d => {
      if (d.id === root) return null;
      if (isStateNode(d)) {
        return d.parent;
      } else {
        return null;
      }
    });

  const stratifiedTree = strat(nodeList);
  const stratifiedList: StratifiedList = stratifiedTree.descendants();
  const stratifiedMap: StratifiedMap = {};

  stratifiedList.forEach(c => (stratifiedMap[c.id!] = c));
  treeLayout(stratifiedMap, current, root);

  const links = stratifiedTree.links();

  const duration = 600;

  const xOffset = gutter;
  const yOffset = verticalSpace;

  return (
    <div id="prov-vis">
      <svg height={height} width={width}>
        <rect height={height} width={width} fill="none" stroke="black" />
        <g transform={translate(width - sideOffset, topOffset)}>
          <NodeGroup
            data={links}
            keyAccessor={link => `${link.source.id}${link.target.id}`}
            {...linkTransitions(
              xOffset,
              yOffset,
              backboneGutter - gutter,
              duration,
            )}>
            {linkArr => (
              <>
                {linkArr.map(link => {
                  const {key, state} = link;

                  return (
                    <g key={key}>
                      <Link {...state} className={treeColor(true)} />
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
              backboneGutter - gutter,
              duration,
            )}>
            {nodes => {
              return (
                <>
                  {nodes.map(node => {
                    const {data: d, key, state} = node;
                    return (
                      <g
                        key={key}
                        onClick={() => changeCurrent(d.id)}
                        transform={translate(state.x, state.y)}>
                        {d.width === 0 ? (
                          <BackboneNode
                            textSize={textSize}
                            radius={backboneCircleRadius}
                            strokeWidth={backboneCircleStroke}
                            duration={duration}
                            first={first}
                            current={current === d.id}
                            node={d.data}
                          />
                        ) : (
                          <circle
                            onClick={() => changeCurrent(d.id)}
                            r={regularCircleRadius}
                            strokeWidth={regularCircleStroke}
                            className={treeColor(false)}
                          />
                        )}
                      </g>
                    );
                  })}
                </>
              );
            }}
          </NodeGroup>
        </g>
      </svg>
    </div>
  );
};

export default ProvVis;
