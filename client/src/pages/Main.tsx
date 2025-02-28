import AddComponent from "@/components/common/Form/AddComponent";
import { useModalContext } from "@/contexts/ModalContext";
import React, { RefObject, useEffect, useRef } from "react";

const Main: React.FC = () => {
  const { openModal, modalState } = useModalContext();
  const mainRef = useRef<HTMLDivElement>();
  console.log(modalState);
  useEffect(() => {
    if (mainRef.current) {
      const click = (e: MouseEvent) => {
        // const elements = document.elementsFromPoint(e.x, e.y);
        // const lowestElement = elements[0];
        // const node = document.createElement("div");
        // lowestElement.appendChild(node);
        openModal(<AddComponent />);
      };

      mainRef.current.addEventListener("click", click);
      return () => {
        mainRef.current!.removeEventListener("click", click);
      };
    }
  }, [mainRef.current]);
  return (
    <div className="main" ref={mainRef as RefObject<HTMLDivElement>}></div>
  );
};

export default Main;
