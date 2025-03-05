import AddComponent from "@/components/common/Form/AddComponent";
import { useModalContext } from "@/contexts/ModalContext";
import React, { RefObject, useEffect, useRef, useState } from "react";

const Main: React.FC = () => {
  const { openModal } = useModalContext();
  const mainRef = useRef<HTMLDivElement>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  // React 상태로 메타키 상태 관리

  // 키 이벤트 핸들러
  useEffect(() => {
    let isClickable = false;
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("KeyDown:", e.code);
      if (e.code === "MetaLeft") {
        isClickable = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log("KeyUp:", e.code);
      if (e.code === "MetaLeft") {
        isClickable = false;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      console.log("MouseDown, MetaAlt pressed:", isClickable);
      if (isClickable) {
        openModal(<AddComponent />);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    if (mainRef) {
      mainRef.current?.addEventListener("mousedown", handleMouseDown);
    }

    // 클린업 함수
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (mainRef) {
        mainRef.current?.removeEventListener("mousedown", handleMouseDown);
      }
    };
  }, [mainRef]);

  return (
    <div className="main" ref={mainRef as RefObject<HTMLDivElement>}></div>
  );
};

export default Main;
