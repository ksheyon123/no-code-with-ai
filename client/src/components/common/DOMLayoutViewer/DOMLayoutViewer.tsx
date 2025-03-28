import React, { useState } from "react";
import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { FaTrash, FaEdit } from "react-icons/fa";
import Drawer from "../Drawer/Drawer";

const DOMLayoutViewer: React.FC = () => {
  const { domStructure } = useBlueprintContext();

  // 재귀적으로 DOM 요소를 렌더링하는 함수
  const renderElement = (id: string, depth: number = 0): React.ReactNode => {
    // domStructure에서 해당 ID의 요소 정보를 가져옵니다.
    const domElement = domStructure.get(id);
    // 요소가 없으면 null을 반환합니다.
    if (!domElement) {
      return null;
    }

    const indent = "ㄴ ";
    const spacing = depth > 0 ? "  ".repeat(depth) : "";

    // 현재 요소 렌더링
    const elementLabel = (
      <div
        key={id}
        style={{
          marginBottom: "4px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", whiteSpace: "pre" }}>
          {depth === 0 ? indent : spacing + indent}
          <div
            style={{
              width: 120,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {id}
          </div>
        </div>
        <div>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
            }}
          >
            <FaEdit color="#ff6b6b" size={12} />
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
            }}
          >
            <FaTrash color="#ff6b6b" size={12} />
          </button>
        </div>
      </div>
    );

    // 자식 요소들을 렌더링합니다.
    const children = domElement.children.map((childId) =>
      renderElement(childId, depth + 1)
    );

    return (
      <React.Fragment key={id}>
        <Drawer title={elementLabel} children={children} />
      </React.Fragment>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 72,
        right: 0,
        width: 300,
        fontFamily: "monospace",
      }}
    >
      {renderElement("root")}
    </div>
  );
};

export default DOMLayoutViewer;
