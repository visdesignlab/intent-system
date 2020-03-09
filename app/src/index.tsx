import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "semantic-ui-css/semantic.min.css";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import { AppConfig, Mode } from "./AppConfig";
import StudyMode from "./StudyMode";
import { getAllTasks } from "./Study/TaskList";

const PROLIFIC_PID = "PROLIFIC_PID";
const STUDY_ID = "STUDY_ID";
const SESSION_ID = "SESSION_ID";

whyDidYouRender(React, {
  trackHooks: true
});

let config: AppConfig = {
  mode: "default",
  participantId: "NULL",
  sessionId: "NULL",
  studyId: "NULL"
};

const url = new URLSearchParams(window.location.search);
if (url.toString().length > 0) {
  const mode = url.get("mode");
  const participantId = url.get(PROLIFIC_PID) || config.participantId;
  const sessionId = url.get(SESSION_ID) || config.sessionId;
  const studyId = url.get(STUDY_ID) || config.studyId;

  config = {
    ...config,
    mode: mode ? (mode.toLocaleLowerCase() as Mode) : config.mode,
    participantId,
    sessionId,
    studyId
  };
}

const isStudy = config.mode === "study";

ReactDOM.render(
  isStudy ? <StudyMode tasks={getAllTasks()} config={config} /> : <App />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
