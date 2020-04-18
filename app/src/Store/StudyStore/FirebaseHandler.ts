import { ProvenanceGraph } from '@visdesignlab/provenance-lib-core';

import { initializeFirebase } from './Firebase';
import { StudyState } from './StudyState';

export const { firestore: db, rtd, graphRTD } = initializeFirebase();

type LoggingParams = {
  participantId: string;
  studyId: string;
  sessionId: string;
  graph: ProvenanceGraph<StudyState, any, any>;
};

type LogStatus = "success" | "error";

type LogData = {
  time: number;
  status: LogStatus;
  participantId: string;
  studyId: string;
  sessionId: string;
  currentNodeId: string;
  err?: any;
};

function getLogData(
  status: LogStatus,
  participantId: string,
  studyId: string,
  sessionId: string,
  currentNodeId: string,
  err: string = ""
): LogData {
  return {
    time: Date.now(),
    status,
    participantId,
    studyId,
    sessionId,
    currentNodeId,
    err,
  };
}

export default function logToFirebase() {
  let addedNodes: string[] = [];

  return function({ participantId, studyId, sessionId, graph }: LoggingParams) {
    const path = `${participantId}/${studyId}/${sessionId}`;
    const nodes = Object.keys(graph.nodes);
    const nodeToAdd: string[] = [];
    for (let node of nodes) {
      if (!addedNodes.includes(node)) {
        nodeToAdd.push(node);
        addedNodes.push(node);
      }
    }

    nodeToAdd.forEach((node) => {
      const actualNode = graph.nodes[node];
      const nodeGraph = actualNode.state.graph;
      if (Object.keys(nodeGraph).length > 0)
        actualNode.state.graph = `${path}/${node}`;
      else actualNode.state.graph = {};
      rtd
        .ref(`${path}/nodes/${node}`)
        .set(actualNode)
        .then(() => {
          const log = getLogData(
            "success",
            participantId,
            studyId,
            sessionId,
            graph.current
          );
          if (Object.keys(nodeGraph).length > 0) {
            graphRTD
              .ref(actualNode.state.graph as string)
              .set(nodeGraph)
              .then(() => {
                rtd.ref(`logging/${log.time}`).set(log);
              });
          }
        })
        .catch((err) => {
          console.error(err);
          const log = getLogData(
            "error",
            participantId,
            studyId,
            sessionId,
            graph.current
          );
          rtd.ref(`logging/${log.time}`).set(log);
          throw new Error("Something went wrong while logging.");
        });
    });
  };
}
