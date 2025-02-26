import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Root from "./pages/Root";
import UI from "./pages/UI";
import Main from "./pages/Main";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Main />} />
          <Route path="ui" element={<UI />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
