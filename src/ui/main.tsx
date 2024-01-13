import * as React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";

(async function main() {
  const App = (await import("./app")).default;

  const rootElement = document.getElementById("root") as HTMLElement;
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </React.StrictMode>
  );
})();
