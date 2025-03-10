import { render, screen } from "@testing-library/react";
import DOMRenderer from "./DOMRenderer";

describe("DOMRenderer 컴포넌트", () => {
  // 단일 아이템 렌더링 테스트
  it("단일 아이템을 올바르게 렌더링한다", () => {
    const singleItem = {
      id: "test-item",
      type: "component",
      label: "테스트 아이템",
    };

    render(<DOMRenderer items={singleItem} />);

    // id로 요소 확인
    const renderedItem = document.getElementById("test-item");
    expect(renderedItem).toBeInTheDocument();

    // 라벨 텍스트 확인
    expect(screen.getByText("테스트 아이템")).toBeInTheDocument();
  });

  // 아이템 배열 렌더링 테스트
  it("아이템 배열을 올바르게 렌더링한다", () => {
    const itemsArray = {
      id: "container",
      type: "container",
      child: [
        { id: "item-1", type: "component", label: "아이템 1" },
        { id: "item-2", type: "component", label: "아이템 2" },
        { id: "item-3", type: "component", label: "아이템 3" },
      ],
    };

    render(<DOMRenderer items={itemsArray} />);

    // 모든 아이템이 렌더링되었는지 확인
    itemsArray.child.forEach((item) => {
      const renderedItem = document.getElementById(item.id);
      expect(renderedItem).toBeInTheDocument();
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  // 중첩된 아이템 렌더링 테스트
  it("중첩된 아이템을 올바르게 렌더링한다", () => {
    const nestedItem = {
      id: "parent",
      type: "container",
      label: "부모 요소",
      child: [
        {
          id: "child",
          type: "component",
          label: "자식 요소",
        },
      ],
    };

    render(<DOMRenderer items={nestedItem} />);

    // 부모 요소 확인
    const parentElement = document.getElementById("parent");
    expect(parentElement).toBeInTheDocument();
    expect(screen.getByText("부모 요소")).toBeInTheDocument();

    // 자식 요소 확인
    const childElement = document.getElementById("child");
    expect(childElement).toBeInTheDocument();
    expect(screen.getByText("자식 요소")).toBeInTheDocument();

    // 부모-자식 관계 확인
    expect(parentElement?.contains(childElement)).toBe(true);
  });

  // 중첩된 아이템 배열 렌더링 테스트
  it("중첩된 아이템 배열을 올바르게 렌더링한다", () => {
    const nestedItemArray = {
      id: "parent",
      type: "container",
      label: "부모 요소",
      child: [
        { id: "child-1", type: "component", label: "자식 요소 1" },
        { id: "child-2", type: "component", label: "자식 요소 2" },
      ],
    };

    render(<DOMRenderer items={nestedItemArray} />);

    // 부모 요소 확인
    const parentElement = document.getElementById("parent");
    expect(parentElement).toBeInTheDocument();
    expect(screen.getByText("부모 요소")).toBeInTheDocument();

    // 자식 요소들 확인
    const childElement1 = document.getElementById("child-1");
    const childElement2 = document.getElementById("child-2");
    expect(childElement1).toBeInTheDocument();
    expect(childElement2).toBeInTheDocument();
    expect(screen.getByText("자식 요소 1")).toBeInTheDocument();
    expect(screen.getByText("자식 요소 2")).toBeInTheDocument();

    // 부모-자식 관계 확인
    expect(parentElement?.contains(childElement1)).toBe(true);
    expect(parentElement?.contains(childElement2)).toBe(true);
  });

  // 다양한 태그 렌더링 테스트
  it("다양한 HTML 태그를 올바르게 렌더링한다", () => {
    const itemsWithTags = {
      id: "tags-container",
      type: "container",
      child: [
        {
          id: "div-item",
          type: "container",
          tag: "div" as const,
          label: "DIV 요소",
        },
        { id: "ul-item", type: "list", tag: "ul" as const, label: "UL 요소" },
        {
          id: "li-item",
          type: "list-item",
          tag: "li" as const,
          label: "LI 요소",
        },
      ],
    };

    render(<DOMRenderer items={itemsWithTags} />);

    // 각 태그 타입 확인
    const divElement = document.getElementById("div-item");
    expect(divElement?.tagName.toLowerCase()).toBe("div");
    expect(screen.getByText("DIV 요소")).toBeInTheDocument();

    const ulElement = document.getElementById("ul-item");
    expect(ulElement?.tagName.toLowerCase()).toBe("ul");
    expect(screen.getByText("UL 요소")).toBeInTheDocument();

    const liElement = document.getElementById("li-item");
    expect(liElement?.tagName.toLowerCase()).toBe("li");
    expect(screen.getByText("LI 요소")).toBeInTheDocument();
  });

  // 기본 태그 테스트
  it("태그가 지정되지 않으면 기본값으로 div를 사용한다", () => {
    const item = {
      id: "default-tag",
      type: "component",
      label: "기본 태그 요소",
    };

    render(<DOMRenderer items={item} />);

    const element = document.getElementById("default-tag");
    expect(element?.tagName.toLowerCase()).toBe("div");
  });

  // 스타일 적용 테스트
  it("기본 스타일이 적용된다", () => {
    const item = {
      id: "styled-item",
      type: "component",
      label: "스타일 요소",
    };

    render(<DOMRenderer items={item} />);

    const element = document.getElementById("styled-item");
    expect(element).toHaveStyle({
      width: 200,
      height: 200,
    });
  });

  // 라벨이 없는 경우 테스트
  it("라벨이 없는 경우 span 요소가 렌더링되지 않는다", () => {
    const item = {
      id: "no-label",
      type: "component",
    };

    render(<DOMRenderer items={item} />);

    const element = document.getElementById("no-label");
    expect(element).toBeInTheDocument();
    expect(element?.querySelector("span")).toBeNull();
  });
});
