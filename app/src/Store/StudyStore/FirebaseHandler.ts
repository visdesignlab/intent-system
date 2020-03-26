import { isStateNode, ProvenanceGraph } from '@visdesignlab/provenance-lib-core';

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
    }
    const p = nodeCollectionRef.doc(key).set(node);
    allDocsAdded.push(p);
  });

  Promise.all(allDocsAdded).catch(err => {
    console.error(err);
    throw new Error("Error pushing nodes");
  });
}
