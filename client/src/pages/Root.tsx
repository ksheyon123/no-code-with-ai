import DOMLayoutViewer from "@/components/common/DOMLayoutViewer/DOMLayoutViewer";
import Header from "@/components/common/Header/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const Root: React.FC = () => {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
};

export default Root;
