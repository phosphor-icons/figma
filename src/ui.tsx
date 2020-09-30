import React, { Suspense } from "react";
import * as ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "./ui.css";

import Toolbar from "./components/Toolbar/Toolbar";
import IconGrid from "./components/IconGrid/IconGrid";

// declare function require(path: string): any

class App extends React.Component {
  textbox: HTMLInputElement;

  countRef = (element: HTMLInputElement) => {
    if (element) element.value = "5";
    this.textbox = element;
  };

  onCreate = () => {
    const count = parseInt(this.textbox.value, 10);
    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", count } },
      "*"
    );
  };

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  render() {
    return (
      <RecoilRoot>
        <div className="app">
          <Toolbar />
          <Suspense fallback={<p>Loading...</p>}>
            <IconGrid />
          </Suspense>
        </div>
      </RecoilRoot>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-page"));
