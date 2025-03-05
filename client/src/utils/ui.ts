import React, { useState, useEffect } from "react";
import * as Babel from "@babel/standalone";
const transpileJSX = () => {
  const jsxCode = `
    <div style={{display: 'flex'}}>
      <div>
        <label>label 텍스트를 표현합니다.</label>
        <input value onChange={() => {}} />
      </div>
      <button disabled={""}>
        이 button 컴포넌트를 표현합니다. default는 disabled input 값이 있으면 abled 됩니다.
      </button>
    </div>
   `;
  try {
    console.log(jsxCode);
    // 안전한 컴포넌트 래퍼로 감싸기
    const wrappedCode = `
        function DynamicComponent(props) {
          return ${jsxCode};
        }
      `;

    // JSX를 JavaScript로 변환
    const result = Babel.transform(wrappedCode, {
      presets: ["react"],
    }).code;

    // 함수로 변환하여 평가
    const transformedCode = `
        ${result}
        return DynamicComponent;
      `;

    // 실행 컨텍스트 생성
    const evalContext: any = {
      React,
      useState,
      useEffect,
      // 다른 필요한 후크나 컴포넌트 추가
    };

    const contextKeys = Object.keys(evalContext);
    const contextValues = contextKeys.map((key) => evalContext[key]);

    // 코드 평가 및 컴포넌트 생성
    const evalFunction = new Function(...contextKeys, transformedCode);
    const DynamicComponent = evalFunction(...contextValues);

    return DynamicComponent;
  } catch (err) {
    console.error("JSX 트랜스파일 오류:", err);
  }
};

const tt = async () => {
  const d = {
    jsx_code:
      "const ComponentName = () => {\n  const [inputValue, setInputValue] = useState('');\n\n  const handleInputChange = (e) => {\n    setInputValue(e.target.value);\n  };\n\n  return (\n    <div style={{display: 'flex'}}>\n      <div>\n        <label>label 텍스트를 표현합니다.</label>\n        <input value={inputValue} onChange={handleInputChange} />\n      </div>\n      <button disabled={!inputValue}>\n        이 button 컴포넌트를 표현합니다. default는 disabled input 값이 있으면 abled 됩니다.\n      </button>\n    </div>\n  );\n};",
    component_name: "ComponentName",
    imports: ["import React, { useState } from 'react';"],
  };
  // 임포트 문과 컴포넌트 코드 결합
  const fullCode = `
    ${d.jsx_code}
  `;
  console.log(fullCode);

  // JSX를 JavaScript로 변환
  const transformedCode = Babel.transform(fullCode, {
    presets: ["react"],
  }).code;

  console.log(transformedCode);
  // 동적으로 컴포넌트 생성
  return transformedCode;
};
export { transpileJSX, tt };
