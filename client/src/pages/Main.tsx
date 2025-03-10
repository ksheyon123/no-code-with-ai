import AddComponent from "@/components/common/Form/AddComponent";
import List from "@/components/common/List/List";
import UISelectModalFooter from "@/components/common/Modal/SubModalComponent/UISelectModalFooter";
import DOMRenderer from "@/components/dom/DOMRenderer/DOMRenderer";
import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";
import { createRandomHash } from "@/utils/crypto";
import React, { RefObject, useEffect, useRef, useState } from "react";

const Main: React.FC = () => {
  const { blueprints, initBlueprint } = useBlueprintContext();
  const { openModal } = useModalContext();
  const mainRef = useRef<HTMLDivElement>(null);
  // 키 이벤트 핸들러
  useEffect(() => {
    let isClickable = false;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "MetaLeft") {
        isClickable = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "MetaLeft") {
        isClickable = false;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isClickable) {
        const p = document.elementsFromPoint(e.x, e.y);
        const tagId = p[0].id;
        const ptagId = p[1].id;

        openModal(
          <AddComponent parentId={ptagId} targetId={tagId} />,
          <></>,
          <UISelectModalFooter />,
          {
            useHeader: false,
            useFooter: true,
            showNavigationButtons: true,
          }
        );
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

  useEffect(() => {
    initBlueprint();
  }, []);

  return (
    <div
      id="main_component"
      className="main"
      ref={mainRef as RefObject<HTMLDivElement>}
    >
      {blueprints && <DOMRenderer items={blueprints} />}
    </div>
  );
};

export default Main;
