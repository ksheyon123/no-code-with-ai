import React, { CSSProperties, ReactNode } from "react";
import { transpileJSX } from "@/utils/ui";
import { DOMBluePrint } from "@/types";

interface IDOMRendererProps {
  items: DOMBluePrint;
}

const DOMRenderer: React.FC<IDOMRendererProps> = ({ items }) => {
  console.log(items);
  // 단일 아이템을 렌더링하는 함수
  const renderItem = (item: DOMBluePrint): ReactNode => {
    const {
      id,
      tag = "div",
      label = "",
      child: childItems,
      jsx,
      componentName,
      imports,
      style,
    } = item;
    // 동적으로 태그 생성
    const Tag = tag as keyof JSX.IntrinsicElements;

    // 자식 요소 렌더링
    let children: ReactNode = null;
    if (childItems) {
      children = Array.isArray(childItems)
        ? childItems.map((child) => renderItem(child))
        : renderItem(childItems);
    }
    if (jsx && componentName && imports) {
      const Componet = transpileJSX({
        jsx,
        componentName,
        imports,
      });
      return <>{!!Componet ? <Componet /> : <></>}</>;
    }

    // 태그와 속성, 자식 요소를 포함한 JSX 반환
    return (
      <Tag
        key={id}
        id={id}
        style={{ width: style?.width || 200, height: style?.height || 200 }}
      >
        {label && <span>{label}</span>}
        {children}
      </Tag>
    );
  };

  // 배열 또는 단일 아이템 처리
  if (Array.isArray(items)) {
    return <>{items.map((item) => renderItem(item))}</>;
  }

  return <>{renderItem(items)}</>;
};

export default DOMRenderer;
