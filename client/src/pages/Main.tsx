import React, { useEffect, useRef, useState } from "react";

const Main: React.FC = () => {
  // 이전에 마우스가 위치한 요소를 추적하기 위한 ref
  const lastHoveredElement = useRef<Element | null>(null);
  // Alt 키가 눌려 있는지 추적하는 상태
  const [isAltKeyPressed, setIsAltKeyPressed] = useState(false);

  useEffect(() => {
    // 마우스 이동 이벤트 리스너 추가
    window.addEventListener("mousemove", handleMouseMove);

    // Alt 키 감지를 위한 이벤트 리스너 추가
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isAltKeyPressed]);

  // Alt 키가 눌렸을 때 호출되는 함수
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Alt") {
      setIsAltKeyPressed(true);
    }
  };

  // Alt 키가 떨어졌을 때 호출되는 함수
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Alt") {
      setIsAltKeyPressed(false);
      // Alt 키가 떨어지면 모든 스타일 초기화
      resetAllStyles();
    }
  };

  // 모든 스타일을 초기화하는 함수
  const resetAllStyles = () => {
    // 이전에 스타일이 적용된 요소가 있으면 초기화
    if (lastHoveredElement.current) {
      resetStyles(lastHoveredElement.current);
      lastHoveredElement.current = null;
    }
  };

  // 마우스 이동 이벤트 핸들러
  const handleMouseMove = (e: MouseEvent) => {
    // Alt 키가 눌려 있지 않으면 아무 작업도 수행하지 않음
    if (!isAltKeyPressed) {
      return;
    }

    // 마우스 좌표에 있는 요소들 가져오기
    const elements = document.elementsFromPoint(e.x, e.y);
    if (elements.length < 2) return;

    const currentElement = elements[0]; // 마우스 바로 아래 요소
    const parentElement = elements[1]; // 부모 요소

    // id 속성이 있는 div 요소만 처리
    if (
      currentElement.tagName !== "DIV" ||
      !currentElement.hasAttribute("id")
    ) {
      // 이전에 스타일이 적용된 요소가 있으면 원래 스타일로 복원
      if (lastHoveredElement.current) {
        resetStyles(lastHoveredElement.current);
        lastHoveredElement.current = null;
      }
      return;
    }

    // 이전에 호버된 요소와 현재 요소가 다르면 이전 요소의 스타일 초기화
    if (
      lastHoveredElement.current &&
      lastHoveredElement.current !== currentElement
    ) {
      resetStyles(lastHoveredElement.current);
    }

    // 현재 요소 저장
    lastHoveredElement.current = currentElement;

    // 부모 요소에 스타일 적용
    if (parentElement.tagName === "DIV") {
      parentElement.setAttribute("style", "position: relative; display: flex;");
    }

    // 현재 요소의 이전 형제 요소와 다음 형제 요소 가져오기
    const prevSibling = currentElement.previousElementSibling;
    const nextSibling = currentElement.nextElementSibling;

    // 현재 요소에 스타일 적용
    currentElement.setAttribute(
      "style",
      "position: relative; width: 100px; height: 20px; transition: 0.2s;"
    );

    // 이전 형제 요소가 있으면 스타일 적용
    if (prevSibling) {
      // 초기 상태 설정
      prevSibling.setAttribute(
        "style",
        "position: relative; width: 100px; height: 20px; transition: 0.2s; left: 0px;"
      );

      // 약간의 지연 후 최종 상태로 변경
      setTimeout(() => {
        prevSibling.setAttribute(
          "style",
          "position: relative; width: 100px; height: 20px; transition: 0.2s; left: -10px;"
        );
      }, 10);
    }

    // 다음 형제 요소가 있으면 스타일 적용
    if (nextSibling) {
      // 초기 상태 설정
      nextSibling.setAttribute(
        "style",
        "position: relative; width: 100px; height: 20px; transition: 0.2s; right: 0px;"
      );

      // 약간의 지연 후 최종 상태로 변경
      setTimeout(() => {
        nextSibling.setAttribute(
          "style",
          "position: relative; width: 100px; height: 20px; transition: 0.2s; right: -10px;"
        );
      }, 10);
    }
  };

  // 스타일 초기화 함수
  const resetStyles = (element: Element) => {
    // 부모 요소 스타일 복원
    const parentElement = element.parentElement;
    if (parentElement) {
      if (parentElement.id === "a") {
        parentElement.setAttribute(
          "style",
          "width: 300px; height: 80px; display: flex;"
        );
      } else {
        parentElement.setAttribute("style", "display: flex;");
      }
    }

    // 현재 요소 스타일 복원
    element.setAttribute("style", "width: 100px; height: 20px;");

    // 이전 형제 요소 스타일 복원
    const prevSibling = element.previousElementSibling;
    if (prevSibling) {
      prevSibling.setAttribute("style", "width: 100px; height: 20px;");
    }

    // 다음 형제 요소 스타일 복원
    const nextSibling = element.nextElementSibling;
    if (nextSibling) {
      nextSibling.setAttribute("style", "width: 100px; height: 20px;");
    }
  };

  return (
    <div id="root" className="main" style={{ display: "flex" }}>
      <div id="a" style={{ width: 300, height: 80, display: "flex" }}>
        <div id="1" style={{ width: 100, height: 20 }}>
          1
        </div>
        <div id="2" style={{ width: 100, height: 20 }}>
          2
        </div>
      </div>
    </div>
  );
};

export default Main;
