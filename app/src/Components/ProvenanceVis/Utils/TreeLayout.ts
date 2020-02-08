import {HierarchyNode} from 'd3';
import {
  StratifiedMap,
  StratifiedList,
  ProvenanceNode,
} from '../components/ProvVis';

export type TreeNode = HierarchyNode<unknown>;

export interface ExtendedHierarchyNode
  extends HierarchyNode<ProvenanceNode<unknown>> {
  column: number;
}

export type ExtendedStratifiedMap = {[key: string]: ExtendedHierarchyNode};

export function treeLayout(
  nodes: StratifiedMap,
  current: string,
  root: string,
) {
  const depthMap: {[key: string]: any} = {};

  const currentPath = getPathTo(nodes, root, current);

  DFS(nodes, root, depthMap, currentPath);

  return currentPath;
}

function DFS(
  nodes: StratifiedMap,
  node: string,
  depthMap: any,
  currentPath: string[],
) {
  let explored = new Set();

  let toExplore = [];

  let currDepth = 0;

  toExplore.push(nodes[node]);

  while (toExplore.length > 0) {
    let temp: any = toExplore.pop();

    if (!explored.has(temp.id)) {
      temp.width = currDepth;
      depthMap[temp.id] = temp.width;
      explored.add(temp.id);
    } else {
      temp.width = depthMap[temp.id];
    }

    if (temp.children) {
      toExplore.push(
        ...temp.children.sort((a: any, b: any) => {
          const aIncludes = currentPath.includes(a.id) ? 1 : 0;
          const bIncludes = currentPath.includes(b.id) ? 1 : 0;
          return aIncludes - bIncludes;
        }),
      );
    } else {
      currDepth++;
    }
  }
}

export function getPathTo(
  nodes: StratifiedMap,
  from: string,
  to: string,
): string[] {
  const path: string[] = [];

  search(nodes, from, to, path);

  return [from, ...path.reverse()];
}

function search(
  nodes: StratifiedMap,
  node: string,
  final: string,
  path: string[],
) {
  if (!nodes[node]) return false;

  if (node === final) {
    path.push(node);
    return true;
  }

  const children = nodes[node].children || [];

  for (let child of children) {
    if (search(nodes, child.id!, final, path)) {
      path.push(child.id!);
      return true;
    }
  }

  return false;
}
