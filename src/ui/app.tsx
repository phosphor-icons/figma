import { useEffect } from "react";

import { Message, MessageType } from "@common/types";
import Toolbar from "./components/Toolbar";
import IconGrid from "./components/IconGrid";
import Footer from "./components/Footer";
import { useStore } from "./state";
import "./app.css";

const App = () => {
  const setConfig = useStore((s) => s.setConfig);

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
      <IconGrid />
      <Footer />
    </div>
  );
};

export default App;
