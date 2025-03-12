import React from "react";
import { DOMStructureProps, Blueprint } from "@/types";
import { useBlueprintContext } from "@/contexts/BlueprintContext";

/**
 * DOMRenderer 컴포넌트
 *
 * domStructure와 blueprint를 받아 DOM 구조를 렌더링합니다.
 * - blueprint가 없으면 id=root를 제외한 모든 DOM 객체는 width: 60, height: 60의 회색 박스로 그려집니다.
 * - blueprint가 있으면 blueprint에 해당하는 JSX를 렌더링합니다.
 */
const DOMRenderer: React.FC = () => {
  // Context에서 domStructure와 blueprints를 가져옵니다.
  const context = useBlueprintContext();

  // props로 전달된 값이 없으면 context에서 가져온 값을 사용합니다.
  const domStructureMap = context.domStructure;
  const blueprintsMap = context.blueprints;

  /**
   * DOM 요소를 렌더링하는 함수
   * @param id 렌더링할 DOM 요소의 ID
   * @param isRoot 루트 요소인지 여부
   * @returns 렌더링된 React 요소
   */
  const renderElement = (
    id: string,
    isRoot: boolean = false
  ): React.ReactNode => {
    // domStructure에서 해당 ID의 요소 정보를 가져옵니다.
    const domElement = domStructureMap.get(id);

    // 요소가 없으면 null을 반환합니다.
    if (!domElement) {
      return null;
    }

    // blueprint에서 해당 ID의 정보를 가져옵니다.
    const blueprint = blueprintsMap.get(id);

    // 자식 요소들을 렌더링합니다.
    const children = domElement.children.map((childId) =>
      renderElement(childId)
    );

    // 형제 요소들을 렌더링합니다.
    const siblings = domElement.siblings.map((siblingId) =>
      renderElement(siblingId)
    );

    // blueprint가 있으면 blueprint에 해당하는 JSX를 렌더링합니다.
    if (blueprint) {
      try {
        // jsx_code가 있으면 해당 JSX를 렌더링합니다.
        if (blueprint.jsx_code) {
          // 실제 프로덕션에서는 이 부분을 동적으로 JSX를 렌더링하는 방식으로 구현해야 합니다.
          // 여기서는 간단히 div로 감싸서 표현합니다.
          return (
            <div
              key={id}
              id={id}
              style={{
                ...(blueprint.styles || {}),
                position: "relative",
              }}
              {...(blueprint.attributes || {})}
            >
              {/* 실제로는 blueprint.jsx_code를 동적으로 렌더링해야 합니다 */}
              <div dangerouslySetInnerHTML={{ __html: blueprint.jsx_code }} />
              {children}
              {siblings}
            </div>
          );
        }
      } catch (error) {
        console.error(`Error rendering blueprint for ${id}:`, error);
      }
    }

    // blueprint가 없거나 jsx_code가 없으면 기본 스타일의 박스를 렌더링합니다.
    // root 요소는 예외적으로 처리합니다.
    return (
      <div
        key={id}
        id={id}
        style={{
          width: isRoot ? "100%" : 60,
          height: isRoot ? "100%" : 60,
          backgroundColor: isRoot ? "transparent" : "#cccccc",
          ...(blueprint?.styles || {}),
        }}
        {...(blueprint?.attributes || {})}
      >
        {children}
        {siblings}
      </div>
    );
  };

  // root 요소부터 시작하여 전체 DOM 구조를 렌더링합니다.
  return <>{renderElement("root", true)}</>;
};

export default DOMRenderer;
