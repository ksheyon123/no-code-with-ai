import React from "react";
import * as Babel from "@babel/standalone";
import { Blueprint } from "@/types";

const transpileJSX = ({ jsx_code, componentName, imports }: Blueprint) => {
  try {
    // 컴포넌트 코드만 사용 (import 문은 제외)
    const fullCode = `
        ${jsx_code}
    `;

    console.log("Full code:", fullCode);

    // JSX를 JavaScript로 변환
    const transformedCode = Babel.transform(fullCode, {
      presets: ["react"],
    });
    console.log("Transformed code:", transformedCode);

    // 변환된 코드가 없으면 오류 처리
    if (!transformedCode.code) {
      throw new Error("변환된 코드가 없습니다.");
    }

    // 컴포넌트 생성 시 필요한 의존성 전달
    const dynamicComponent = new Function(
      "React",
      "useState",
      `${transformedCode.code}; return ${componentName};`
    )(React, React.useState);
    console.log("Created component:", dynamicComponent);

    // 유효한 컴포넌트인지 확인
    if (typeof dynamicComponent === "function") {
      return dynamicComponent;
    } else {
      console.error("생성된 컴포넌트가 유효한 React 컴포넌트가 아닙니다.");
    }
  } catch (error) {
    console.error("컴포넌트 생성 오류:", error);
  }

  return null; // 오류 발생 시 명시적으로 null 반환
};

export { transpileJSX };
