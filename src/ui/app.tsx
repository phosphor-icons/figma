import { Suspense, useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { Message, MessageType } from "@common/types";
import Toolbar from "./components/Toolbar";
import IconGrid from "./components/IconGrid";
import Footer from "./components/Footer";
import { configAtom } from "./state";
import "./app.css";

const App = () => {
  const setConfig = useSetRecoilState(configAtom);

  useEffect(() => {
    onmessage = (event: MessageEvent<{ pluginMessage: Message }>) => {
      if (event.data.pluginMessage.type === "config") {
        setConfig(event.data.pluginMessage.payload);
      }
    };

    parent.postMessage({ pluginMessage: { type: MessageType.CONFIG } }, "*");
  }, []);

  return (
    <div className="app">
      <Toolbar />
      <Suspense fallback={null}>
        <IconGrid />
      </Suspense>
      <Footer />
    </div>
  );
};

export default App;
