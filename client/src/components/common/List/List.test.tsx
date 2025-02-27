import { render, screen } from "@testing-library/react";
import List, { Item } from "./List";

describe("List 컴포넌트", () => {
  // 기본 items 배열 테스트
  it("items 배열을 받아 렌더링한다", () => {
    // 테스트용 데이터
    const items: Item[] = [
      { id: "1", label: "아이템 1" },
      { id: "2", label: "아이템 2" },
      { id: "3", label: "아이템 3" },
    ];

    // 컴포넌트 렌더링
    render(<List items={items} />);

    // 각 아이템이 화면에 렌더링되었는지 확인
    items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  // 중첩된 items 배열 테스트
  it("중첩된 items 배열을 받아 렌더링한다", () => {
    // 중첩된 테스트용 데이터
    const nestedItems: Item[] = [
      {
        id: "1",
        label: "부모 아이템 1",
        items: [
          { id: "1-1", label: "자식 아이템 1-1" },
          { id: "1-2", label: "자식 아이템 1-2" },
        ],
      },
      {
        id: "2",
        label: "부모 아이템 2",
        items: [
          { id: "2-1", label: "자식 아이템 2-1" },
          {
            id: "2-2",
            label: "자식 아이템 2-2",
            items: [{ id: "2-2-1", label: "손자 아이템 2-2-1" }],
          },
        ],
      },
    ];

    const renderer = (item: Item) => {
      const { label } = item;
      return (
        <>
          <label>{label}</label>
          <List {...item} itemRenderer={renderer} />
        </>
      );
    };

    // 컴포넌트 렌더링
    render(<List items={nestedItems} itemRenderer={renderer} />);

    // 모든 아이템이 화면에 렌더링되었는지 확인
    expect(screen.getByText("부모 아이템 1")).toBeInTheDocument();
    expect(screen.getByText("자식 아이템 1-1")).toBeInTheDocument();
    expect(screen.getByText("자식 아이템 1-2")).toBeInTheDocument();
    expect(screen.getByText("부모 아이템 2")).toBeInTheDocument();
    expect(screen.getByText("자식 아이템 2-1")).toBeInTheDocument();
    expect(screen.getByText("자식 아이템 2-2")).toBeInTheDocument();
    expect(screen.getByText("손자 아이템 2-2-1")).toBeInTheDocument();
  });

  // 빈 items 배열 테스트
  it("빈 items 배열을 받으면 아무것도 렌더링하지 않는다", () => {
    // 빈 배열로 컴포넌트 렌더링
    render(<List items={[]} />);

    // 리스트 컨테이너는 있지만 내용이 없는지 확인
    const listElement = screen.getByRole("list");
    expect(listElement).toBeInTheDocument();
    expect(listElement.children.length).toBe(0);
  });

  // items prop이 없는 경우 테스트
  it("items prop이 없으면 아무것도 렌더링하지 않는다", () => {
    // items prop 없이 컴포넌트 렌더링
    render(<List />);

    // 리스트 컨테이너는 있지만 내용이 없는지 확인
    const listElement = screen.getByRole("list");
    expect(listElement).toBeInTheDocument();
    expect(listElement.children.length).toBe(0);
  });

  // 커스텀 itemRenderer를 사용하는 테스트
  it("itemRenderer prop을 사용하여 커스텀 렌더링을 한다", () => {
    // 테스트용 데이터
    const items: Item[] = [
      { id: "1", label: "아이템 1" },
      { id: "2", label: "아이템 2" },
      { id: "3", label: "아이템 3" },
    ];

    // 커스텀 렌더러 함수
    const customRenderer = (item: Item) => (
      <div key={item.id} data-testid={`custom-item-${item.id}`}>
        커스텀: {item.label}
      </div>
    );

    // 컴포넌트 렌더링
    render(<List items={items} itemRenderer={customRenderer} />);

    // 커스텀 렌더러로 렌더링된 아이템 확인
    items.forEach((item) => {
      const customItem = screen.getByTestId(`custom-item-${item.id}`);
      expect(customItem).toBeInTheDocument();
      expect(customItem).toHaveTextContent(`커스텀: ${item.label}`);
    });
  });

  // 중첩된 아이템에 대한 커스텀 itemRenderer 테스트
  it("중첩된 아이템에 대해 itemRenderer prop을 사용한다", () => {
    // 중첩된 테스트용 데이터
    const nestedItems: Item[] = [
      {
        id: "1",
        label: "부모 아이템 1",
        items: [
          { id: "1-1", label: "자식 아이템 1-1" },
          { id: "1-2", label: "자식 아이템 1-2" },
        ],
      },
    ];

    // 커스텀 렌더러 함수
    const customRenderer = (item: Item) => (
      <div key={item.id} data-testid={`custom-item-${item.id}`}>
        <span>커스텀: {item.label}</span>
        {!!item.items && <List {...item} itemRenderer={customRenderer} />}
      </div>
    );

    // 컴포넌트 렌더링
    render(<List items={nestedItems} itemRenderer={customRenderer} />);

    // 부모 아이템 확인
    const parentItem = screen.getByTestId("custom-item-1");
    expect(parentItem).toBeInTheDocument();
    expect(parentItem).toHaveTextContent("커스텀: 부모 아이템 1");

    const childItem1 = screen.getByTestId("custom-item-1-1");
    expect(childItem1).toBeInTheDocument();
    expect(childItem1).toHaveTextContent("커스텀: 자식 아이템 1-1");

    const childItem2 = screen.getByTestId("custom-item-1-2");
    expect(childItem2).toBeInTheDocument();
    expect(childItem2).toHaveTextContent("커스텀: 자식 아이템 1-2");
  });
});
