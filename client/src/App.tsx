import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Root from "./pages/Root";
import UI from "./pages/UI";
import Main from "./pages/Main";
import { ModalContextProvider } from "./contexts/ModalContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ModalContextProvider>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Main />} />
            <Route path="ui" element={<UI />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ModalContextProvider>
    </BrowserRouter>
  );
};

export default App;
