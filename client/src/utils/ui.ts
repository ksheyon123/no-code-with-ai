import React, { useState, useEffect } from "react";
import * as Babel from "@babel/standalone";
const transpileJSX = async () => {
  try {
    const d = {
      jsx_code:
        "const ComponentName = () => {\n  const [inputValue, setInputValue] = useState('');\n\n  const handleInputChange = (e) => {\n    setInputValue(e.target.value);\n  };\n\n  return (\n    <div style={{display: 'flex'}}>\n      <div>\n        <label>label 텍스트를 표현합니다.</label>\n        <input value={inputValue} onChange={handleInputChange} />\n      </div>\n      <button disabled={!inputValue}>\n        이 button 컴포넌트를 표현합니다. default는 disabled input 값이 있으면 abled 됩니다.\n      </button>\n    </div>\n  );\n};",
      component_name: "ComponentName",
      imports: ["import React, { useState } from 'react';"],
    };

    // 컴포넌트 코드만 사용 (import 문은 제외)
    const fullCode = `
      ${d.jsx_code}
    `;

    console.log("Full code:", fullCode);

    // JSX를 JavaScript로 변환
    const transformedCode = Babel.transform(fullCode, {
      presets: ["react"],
    }).code;

    console.log("Transformed code:", transformedCode);

    // 컴포넌트 생성 시 필요한 의존성 전달
    const dynamicComponent = new Function(
      "React",
      "useState",
      transformedCode + `; return ${d.component_name};`
    )(React, React.useState);

    console.log("Created component:", dynamicComponent);

    // 유효한 컴포넌트인지 확인
    if (typeof dynamicComponent === "function") {
      return () => dynamicComponent;
    } else {
      console.error("생성된 컴포넌트가 유효한 React 컴포넌트가 아닙니다.");
    }
  } catch (error) {
    console.error("컴포넌트 생성 오류:", error);
  }
};

export { transpileJSX };
