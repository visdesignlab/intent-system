import { ProvenanceGraph } from '@visdesignlab/provenance-lib-core';

import { initializeFirebase } from './Firebase';
import { StudyState } from './StudyState';

const { firestore: db, rtd } = initializeFirebase();

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

export default async function logToFirebase({
  participantId,
  studyId,
  sessionId,
  graph,
}: LoggingParams) {
  const path = `${participantId}/${studyId}/${sessionId}`;

  rtd
    .ref(path)
    .set(graph)
    .then(() => {
      const log = getLogData(
        "success",
        participantId,
        studyId,
        sessionId,
        graph.current
      );
      rtd.ref(`logging/${log.time}`).set(log);
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
}
