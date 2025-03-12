import Header from "@/components/common/Header/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const Root: React.FC = () => {
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
    </>
  );
};

export default Root;
