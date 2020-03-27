import { isStateNode, ProvenanceGraph } from '@visdesignlab/provenance-lib-core';

import { IntentState } from '../IntentState';
import { initializeFirebase } from './Firebase';
import { StudyState } from './StudyState';

const { firestore: db } = initializeFirebase();

type LoggingParams = {
  participantId: string;
  studyId: string;
  sessionId: string;
  graph: ProvenanceGraph<StudyState, any, any>;
};

export default async function logToFirebase({
  participantId,
  studyId,
  sessionId,
  graph
}: LoggingParams) {
  const mainCollectionId = `${participantId}_${studyId}`;
  const mainDocId = sessionId;
  const { current, root, nodes } = graph;

  const mainDocRef = db.collection(mainCollectionId).doc(mainDocId);
  const nodeCollectionRef = mainDocRef.collection("nodes");
  const allDocsAdded: Promise<any>[] = [];

  mainDocRef
    .set({
      current,
      root
    })
    .catch(err => {
      console.error(err);
      throw new Error("Error setting main document");
    });

  const nodeKeys = Object.keys(nodes);

  nodeKeys.forEach(key => {
    const node = nodes[key];
    if (isStateNode(node)) {
      node.artifacts.diffs = [];
      if (node.state.graph !== "None") {
        const g = JSON.parse(node.state.graph) as ProvenanceGraph<
          IntentState,
          any,
          any
        >;
        node.state.graph = g.nodes[g.current].state.dataset.key;
      }
    }
    const p = nodeCollectionRef.doc(key).set(node);
    allDocsAdded.push(p);
  });

  Promise.all(allDocsAdded).catch(err => {
    console.error(err);
    throw new Error("Error pushing nodes");
  });
}
