import React, { RefObject, useEffect, useRef } from "react";
import DOMRenderer from "@/components/dom/DOMRenderer/DOMRenderer";
import AddComponent from "@/components/common/Form/AddComponent";
import UISelectModalFooter from "@/components/common/Modal/SubModalComponent/UISelectModalFooter";
import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";
import { ElementGenerationParams } from "@/types";
import LNB from "@/components/common/LNB/LNB";

const Main: React.FC = () => {
  const { initDomStructure } = useBlueprintContext();
  const { openModal } = useModalContext<ElementGenerationParams>();
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
          <AddComponent parentElId={ptagId} curElId={tagId} />,
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
    initDomStructure("root", {
      children: [],
      siblings: [],
    });
  }, []);

  return (
    <div className="main">
      <LNB children={<></>} />
      <div
        id="main_component"
        className="css_wrapper"
        ref={mainRef as RefObject<HTMLDivElement>}
      >
        <DOMRenderer />
      </div>
    </div>
  );
};

export default Main;
