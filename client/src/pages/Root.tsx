import React from "react";
import { Outlet } from "react-router-dom";
import LNB from "../components/LNB/LNB";

const Root: React.FC = () => {
  return (
    <div className="root-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
