import React from "react";
import * as Babel from "@babel/standalone";
import { Blueprint } from "@/types";

const transpileJSX = ({
  new_id,
  html,
  functions,
  component_name,
  styles,
  props,
  imports,
}: Blueprint) => {
  try {
    // 컴포넌트 코드만 사용 (import 문은 제외)
    const fullCode = `
      const ${component_name} = (${props}) => {

        const styles = ${JSON.stringify(styles)}
        ${functions.join("\n")}
        return (
          ${html.replace("new_id", '"' + new_id + '"')}
        )
      }
    `;
    console.log("Full code : ", fullCode);

    // JSX를 JavaScript로 변환
    const transformedCode = Babel.transform(fullCode, {
      presets: ["react"],
    });

    // 변환된 코드가 없으면 오류 처리
    if (!transformedCode.code) {
      throw new Error("변환된 코드가 없습니다.");
    }

    // 컴포넌트 생성 시 필요한 의존성 전달
    const dynamicComponent = new Function(
      "React",
      "useState",
      `${transformedCode.code}; return ${component_name};`
    )(React, React.useState);

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

const transpileReactComponent = (props: Blueprint) => {
  const { attributes, styles } = props;

  const reactEl = React.createElement("div", {
    ...(attributes && { property: attributes }),
    ...(styles && { style: styles }),
  });
  console.log(reactEl);
  return reactEl;
};

export { transpileJSX, transpileReactComponent };
