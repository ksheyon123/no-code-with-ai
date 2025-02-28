import { useModalContext } from "@/contexts/ModalContext";
import React, { useEffect, useRef, RefObject } from "react";
import { Outlet } from "react-router-dom";

const Root: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>();
  const { openModal } = useModalContext();
  useEffect(() => {
    if (mainRef.current) {
      console.log("Mounted");
      mainRef.current.addEventListener("click", () => {
        console.log("CLick");
        openModal(<></>);
      });

      return () => mainRef.current?.removeEventListener("click", () => {});
    }
  }, [mainRef.current]);
  return (
    <div className="main" ref={mainRef as RefObject<HTMLDivElement>}>
      <Outlet />
    </div>
  );
};

export default Root;
