import React, { FC, ReactChild } from "react";
import translate from "../Utils/translate";
import { ProvenanceNode, StateNode } from "@visdesignlab/provenance-lib-core";
import { treeColor } from "./Styles";
import { Animate } from "react-move";
import { EventConfig } from "../Utils/EventConfig";
import { BundleMap } from "../Utils/BundleMap";
import { Popup } from "semantic-ui-react";

interface BackboneNodeProps<T, S extends string, A> {
  first: boolean;
  iconOnly:boolean;
  current: boolean;
  duration: number;
  node: StateNode<T, S, A>;
  radius: number;
  strokeWidth: number;
  textSize: number;
  nodeMap: any;
  annotationOpen: number;
  setAnnotationOpen: any;
  exemptList: string[];
  setExemptList: any;
  bundleMap?: BundleMap;
  clusterLabels: boolean;
  eventConfig?: EventConfig<S>;
  popupContent?: (nodeId: StateNode<T, S, A>) => ReactChild;
  annotationContent?: (nodeId: StateNode<T, S, A>) => ReactChild;
  expandedClusterList?: string[];
}

function BackboneNode<T, S extends string, A>({
  first,
  iconOnly,
  current,
  node,
  duration,
  radius,
  strokeWidth,
  textSize,
  nodeMap,
  annotationOpen,
  setAnnotationOpen,
  exemptList,
  setExemptList,
  bundleMap,
  clusterLabels,
  eventConfig,
  popupContent,
  annotationContent,
  expandedClusterList
}: BackboneNodeProps<T, S, A>) {
  const padding = 15;

  let cursorStyle = {
    cursor:"pointer"
  } as React.CSSProperties;

  // console.log(JSON.parse(JSON.stringify(node)));
  let glyph = (
    <circle
      style={cursorStyle}
      onClick={() => nodeClicked(node)}
      className={treeColor(current)}
      r={radius}
      strokeWidth={strokeWidth}
    />
  );

  // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap)

  let dropDownAdded = false;

  if (eventConfig) {
    const eventType = node.metadata.type;
    if (eventType && eventType in eventConfig && eventType !== "Root") {
      const { bundleGlyph, currentGlyph, backboneGlyph } = eventConfig[
        eventType
      ];
      if (bundleMap && Object.keys(bundleMap).includes(node.id)) {
        dropDownAdded = true;
        glyph = (
          <g style={cursorStyle} onClick={() => nodeClicked(node)} fontWeight={"none"}>
            {bundleGlyph}
          </g>
        );
      } else if (current) {
        glyph = (
          <g style={cursorStyle} onClick={() => nodeClicked(node)} fontWeight={"bold"}>
            {currentGlyph}
          </g>
        );
      } else {
        glyph = (
          <g style={cursorStyle} onClick={() => nodeClicked(node)} fontWeight={"none"}>
            {backboneGlyph}
          </g>
        );
      }
    }
  }

  let label:string = "";
  let annotate:string = "";

  if (node.artifacts.extra.length > 0) {
    annotate = ((node.artifacts.extra[node.artifacts.extra.length - 1].e) as any).annotation;
  }


  if (bundleMap && Object.keys(bundleMap).includes(node.id) && clusterLabels) {
    label = bundleMap[node.id].bundleLabel;
  } else {
    label = node.label;
  }
  // else if(!backboneBundleNodes.includes(node.id) || !clusterLabels)
  // {
  //   label = node.label;
  // }
  //
  if (!nodeMap[node.id]) {
    return null;
  }



  if(annotate.length > 23)
    annotate = annotate.substr(0, 23) + "..";

  if(label.length > 23)
    label = label.substr(0, 23) + "..";

  return (
    <Animate
      start={{ opacity: 0 }}
      enter={{
        opacity: [1],
        timing: { duration: 100, delay: first ? 0 : duration }
      }}
    >
      {state => (
        <>
          {popupContent !== undefined && nodeMap[node.id].depth > 0 ? (
            <Popup content={popupContent(node)} trigger={glyph} />
          ) : (
            glyph
          )}
          {/* {glyph} */}
          <g
            style={{ opacity: state.opacity }}
            transform={translate(padding, 0)}
          >
            {!iconOnly ?
              (<g>

              { dropDownAdded ?
                (<text style={cursorStyle} onClick={() => nodeClicked(node)} fontSize={10} fill={"#39CCCC"} textAnchor="middle" alignmentBaseline="middle" x={1} y={0} fontFamily="FontAwesome">{(expandedClusterList && expandedClusterList.includes(node.id)) ? "\uf0d8" :"\uf0d7"}</text>)
                : (<g></g>)
              }
              <text
              y={-7}
              x={dropDownAdded ? 10 : 0}
              dominantBaseline="middle"
              textAnchor="start"
              fontSize={textSize}
              fontWeight={"bold"}
              onClick={() => labelClicked(node)}
            >{label}</text>,

            <text
            y={7}
            x={dropDownAdded ? 10 : 0}
            dominantBaseline="middle"
            textAnchor="start"
            fontSize={textSize}
            fontWeight={"regular"}
            onClick={() => labelClicked(node)}
          >{annotate}</text></g>) :
            (<g>
              { dropDownAdded ?
                (<text style={cursorStyle} onClick={() => nodeClicked(node)} fontSize={10} fill={"#39CCCC"} textAnchor="middle" alignmentBaseline="middle" x={1} y={0} fontFamily="FontAwesome">{(expandedClusterList && expandedClusterList.includes(node.id)) ? "\uf0d8" :"\uf0d7"}</text>)
                : (<g></g>)
              }
            </g>)

            }

            {annotationOpen !== -1 &&
            nodeMap[node.id].depth === annotationOpen &&
            annotationContent ? (
              <g>{annotationContent(nodeMap[node.id])}</g>
            ) : (
              <g></g>
            )}
          </g>
        </>
      )}
    </Animate>
  );

  function labelClicked(node: ProvenanceNode<T, S, A>) {
    if (!annotationContent) {
      return;
    } else if (annotationOpen === nodeMap[node.id].depth) {
      setAnnotationOpen(-1);
    } else {
      setAnnotationOpen(nodeMap[node.id].depth);
    }
  }

  function nodeClicked(node: ProvenanceNode<T, S, A>) {
    if (bundleMap && Object.keys(bundleMap).includes(node.id)) {
      let exemptCopy: string[] = Array.from(exemptList);

      exemptCopy.includes(node.id)
        ? exemptCopy.splice(
            exemptCopy.findIndex(d => d === node.id),
            1
          )
        : exemptCopy.push(node.id);

      setExemptList(exemptCopy);
    }

    if (
      annotationOpen !== -1 &&
      (nodeMap[node.id].width > 0 || nodeMap[node.id].depth !== annotationOpen)
    ) {
      setAnnotationOpen(-1);
    }
  }
}

export default BackboneNode;

const Label: FC<{ label: string } & React.SVGProps<SVGTextElement>> = (props: {
  label: string;
}) => {
  return <text {...props}>{props.label}</text>;
};
