import React from "react";
import { DOMStructureProps, Blueprint } from "@/types";
import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { transpileJSX, transpileReactComponent } from "@/utils/ui";

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

    // blueprint가 있으면 blueprint에 해당하는 JSX를 렌더링합니다.
    if (blueprint) {
      try {
        console.log(blueprint);
        // jsx_code가 있으면 해당 JSX를 렌더링합니다.
        if (blueprint.TranspiledComponent) {
          const { TranspiledComponent } = blueprint;
          //{
          // 'new_id': '72b0d5789ef8ad58411123c518842ace',
          // 'target_id': 'root',
          // 'jsx_code': "const CenteredWrapper = ({ children }) => {\n  return (\n    <div style={{\n      display: 'flex',\n      justifyContent: 'center',\n      alignItems: 'center',\n      width: '100%',\n      height: '100%'\n    }}>\n      {children}\n    </div>\n  );\n};",
          // 'component_name': 'CenteredWrapper',
          // 'imports': ["import React from 'react';"],
          // 'styles': {'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'width': '100%', 'height': '100%'},
          // 'attributes': {'children': '하위 컴포넌트들을 children prop으로 받아 렌더링합니다.'}
          // }
          return (
            <TranspiledComponent key={blueprint.new_id}>
              {children}
            </TranspiledComponent>
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
          ...(isRoot && {
            width: "100%",
            height: "100%",
          }),
          ...(!isRoot && {
            minWidth: 60,
            minHeight: 60,
          }),
          backgroundColor: isRoot ? "transparent" : "#cccccc",
          ...(blueprint?.styles || {}),
        }}
        {...(blueprint?.attributes || {})}
      >
        {children}
      </div>
    );
  };

  // root 요소부터 시작하여 전체 DOM 구조를 렌더링합니다.
  return <>{renderElement("root", true)}</>;
};

export default DOMRenderer;
