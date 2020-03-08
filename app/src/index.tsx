import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "semantic-ui-css/semantic.min.css";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import { AppConfig, ShowCategories, Mode } from "./AppConfig";

whyDidYouRender(React, {
    trackHooks: true
});

let config: AppConfig = {
    mode: "default",
    datasetName: "cluster",
    showCategories: "show"
};

const url = new URLSearchParams(window.location.search);
if (url.toString().length > 0) {
    const datasetName = url.get("dataset");
    const mode = url.get("mode");
    const showCategories = url.get("cat");

    config = {
        ...config,
        datasetName: datasetName ? datasetName : config.datasetName,
        mode: mode ? (mode.toLocaleLowerCase() as Mode) : config.mode,
        showCategories: showCategories ? (showCategories.toLocaleLowerCase() as ShowCategories) : config.showCategories
    };
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
