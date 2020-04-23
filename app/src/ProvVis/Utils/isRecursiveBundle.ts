import { BundleMap } from '../Utils/BundleMap';
import findBundleParent from "../Utils/findBundleParent";


import {
  isStateNode
} from "@visdesignlab/provenance-lib-core";

//Using this function for one of the collapsing options. not yet finished.

export default function isRecursiveParent(nodeId:string, nodeList:any, bundledNodes:any, expandedClusterList:any, bundleMap?: BundleMap): boolean {

  return false;
  // let curr = nodeList.filter(function(d:any) {
  //   return d.id === nodeId;
  // })[0];
  //
  // while (true) {
  //   if(!bundleMap)
  //     return false;
  //
  //   if(curr === undefined)
  //     return false;
  //
  //   if(bundledNodes.includes(curr.parent) && !expandedClusterList.includes(findBundleParent(curr.parent))){
  //     return true;
  //   }
  //
  //   let temp = nodeList.filter(function(d:any) {
  //     return d.id === curr.parent;
  //   })[0];
  //
  //     curr = temp;
  // }
}
