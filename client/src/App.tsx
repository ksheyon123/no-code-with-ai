import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Root from "./pages/Root";
import UI from "./pages/UI";
import Main from "./pages/Main";
import Entry from "./pages/Entry";
import { ModalContextProvider } from "@/contexts/ModalContext";
import { BlueprintContextProvider } from "@/contexts/BlueprintContext";

import { initWorker } from "./workers/architectureWorkerManager";

const App: React.FC = () => {
  useEffect(() => {
    initWorker();
  }, []);
  return (
    <BrowserRouter>
      <BlueprintContextProvider>
        <ModalContextProvider>
          <Routes>
            <Route path="/" element={<Root />}>
              <Route index path="" element={<Entry />} />
              <Route path="main" element={<Main />} />
              <Route path="ui" element={<UI />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ModalContextProvider>
      </BlueprintContextProvider>
    </BrowserRouter>
  );
};

export default App;
