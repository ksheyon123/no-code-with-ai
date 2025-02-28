import { useModalContext } from "@/contexts/ModalContext";
import React, { useEffect, useRef, RefObject } from "react";
import { Outlet } from "react-router-dom";

const Root: React.FC = () => {
  const { openModal } = useModalContext();
  // useEffect(() => {
  //   // Normal : 추가하기
  //   // Alt : 안에 넣기
  //   if (mainRef.current) {
  //     let x = null;
  //     let y = null;
  //     const getCoord = (e: MouseEvent) => {
  //       const xCoord = e.x;
  //       const yCoord = e.y;
  //       x = xCoord;
  //       y = yCoord;
  //     };

  //     window.addEventListener("mouseenter", getCoord);

  //     mainRef.current.addEventListener("click", () => {
  //       openModal(<></>);
  //     });

  //     return () => {
  //       mainRef.current?.removeEventListener("click", () => {});
  //       mainRef.current?.removeEventListener("mouseenter", getCoord);
  //     };
  //   }
  // }, [mainRef.current]);
  return <Outlet />;
};

export default Root;
