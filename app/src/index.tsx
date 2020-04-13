import 'semantic-ui-css/semantic.min.css';

import whyDidYouRender from '@welldone-software/why-did-you-render';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';

import App from './App';
import { AppConfig, Mode } from './AppConfig';
import * as serviceWorker from './serviceWorker';
import { DatasetType } from './Study/TaskList';
import StudyMode from './StudyMode';

const PROLIFIC_PID = "PROLIFIC_PID";
const STUDY_ID = "STUDY_ID";
const SESSION_ID = "SESSION_ID";

whyDidYouRender(React, {
  trackHooks: true
});

const userAgent = navigator.userAgent.toLocaleLowerCase();
const isCompatible =
  userAgent.includes("chrome") || userAgent.includes("firefox");

const currTime = Date.now();
console.log(currTime);

export const url = new URLSearchParams(window.location.search);

export function useConfig(): AppConfig {
  let config: AppConfig = {
    mode: "default",
    participantId: "NULL",
    sessionId: "NULL",
    studyId: "NULL",
    coding: "no",
    pred: "auto",
    debugMode: false,
    taskId: "",
    count: 10000,
    task: "none"
  };

  const { search = "" } = useLocation();
  const url = new URLSearchParams(useLocation().search);

  if (search.length === 0) return config;

  const mode = url.get("mode");
  const participantId = url.get(PROLIFIC_PID) || config.participantId;
  let sessionId = url.get(SESSION_ID) || config.sessionId;
  const studyId = url.get(STUDY_ID) || config.studyId;
  const coding: any = url.get("coding") || config.coding;
  let pred: any = url.get("pred") || config.pred;
  let debug: boolean = url.get("debug") ? true : config.debugMode;
  let taskId: string = url.get("taskId") || config.taskId;
  let count: number = parseInt(url.get("count") || config.count.toString());
  let task: DatasetType = "none";
  if (count === 0) count += 1;

  const urlCategory = url.get("taskCategory");
  if (urlCategory) {
    if (urlCategory === "lr") task = "linear regression";
    else if (urlCategory === "qr") task = "quadratic regression";
    else task = urlCategory as any;
  }

  sessionId = `${sessionId}_${currTime}`;

  if (coding === "yes") pred = "manual";

  return {
    ...config,
    mode: mode ? (mode.toLocaleLowerCase() as Mode) : config.mode,
    participantId,
    sessionId,
    studyId,
    coding,
    pred,
    taskId,
    count,
    task,
    debugMode: debug
  };
}

const render = (
  <BrowserRouter>
    <Switch>
      <Route path="/study">
        <StudyMode />
        <Route exact path="/">
          <App />
        </Route>
      </Route>
    </Switch>
  </BrowserRouter>
);

if (!isCompatible) {
  ReactDOM.render(
    <div>
      Please use latest version of either Chrome (recommended) or Firefox to
      complete this study.
    </div>,
    document.getElementById("root")
  );
} else {
  ReactDOM.render(render, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
