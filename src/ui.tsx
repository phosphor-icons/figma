import React, { Suspense } from "react";
import * as ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "./ui.css";

import Toolbar from "./components/Toolbar/Toolbar";
import IconGrid from "./components/IconGrid/IconGrid";
import Footer from "./components/Footer/Footer";

const App: React.FC<{}> = () => {
  return (
    <RecoilRoot>
      <div className="app">
        <Toolbar />
        <Suspense fallback={<p>Loading...</p>}>
          <IconGrid />
        </Suspense>
        <Footer />
      </div>
    </RecoilRoot>
  );
};

ReactDOM.render(<App />, document.getElementById("react-page"));
