import React from "react";
import { Outlet } from "react-router-dom";

const Root: React.FC = () => {
  return (
    <main className="main">
      <Outlet />
    </main>
  );
};

export default Root;
