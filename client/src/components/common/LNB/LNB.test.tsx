import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LNB from "./LNB";

describe("LNB 컴포넌트", () => {
  // 계층 구조를 가진 메뉴 아이템 목록
  const mockItems = [
    {
      id: "1",
      label: "상위메뉴1",
      children: [
        {
          id: "1-1",
          label: "하위메뉴1-1",
          children: [
            { id: "1-1-1", label: "하위메뉴1-1-1" },
            { id: "1-1-2", label: "하위메뉴1-1-2" },
          ],
        },
        { id: "1-2", label: "하위메뉴1-2" },
      ],
    },
    {
      id: "2",
      label: "상위메뉴2",
      children: [{ id: "2-1", label: "하위메뉴2-1" }],
    },
  ];

  test("렌더링이 정상적으로 되는지 확인", () => {
    render(<LNB items={mockItems} />);
    const lnbElement = screen.getByTestId("lnb");
    expect(lnbElement).toBeInTheDocument();
  });

  test("상위 메뉴 아이템이 올바르게 렌더링되는지 확인", () => {
    render(<LNB items={mockItems} />);

    // 상위 메뉴만 초기에 렌더링되어야 함
    expect(screen.getByText("상위메뉴1")).toBeInTheDocument();
    expect(screen.getByText("상위메뉴2")).toBeInTheDocument();

    // 하위 메뉴는 초기에 렌더링되지 않아야 함
    expect(screen.queryByText("하위메뉴1-1")).not.toBeInTheDocument();
    expect(screen.queryByText("하위메뉴1-2")).not.toBeInTheDocument();
  });

  test("상위 메뉴 클릭 시 모달에 하위 메뉴가 표시되는지 확인", () => {
    render(<LNB items={mockItems} />);

    // 상위 메뉴 클릭
    userEvent.click(screen.getByText("상위메뉴1"));

    // 하위 메뉴가 모달에 표시되어야 함
    const modal = screen.getByTestId("lnb-modal");
    expect(modal).toBeInTheDocument();
    expect(screen.getByText("하위메뉴1-1")).toBeInTheDocument();
    expect(screen.getByText("하위메뉴1-2")).toBeInTheDocument();
  });

  test("하위 메뉴 클릭 시 다음 레벨의 모달이 표시되는지 확인", () => {
    render(<LNB items={mockItems} />);

    // 상위 메뉴 클릭
    userEvent.click(screen.getByText("상위메뉴1"));

    // 하위 메뉴 클릭
    userEvent.click(screen.getByText("하위메뉴1-1"));

    // 다음 레벨의 모달이 표시되어야 함
    const modals = screen.getAllByTestId("lnb-modal");
    expect(modals.length).toBe(2); // 두 개의 모달이 있어야 함

    // 다음 레벨의 하위 메뉴가 표시되어야 함
    expect(screen.getByText("하위메뉴1-1-1")).toBeInTheDocument();
    expect(screen.getByText("하위메뉴1-1-2")).toBeInTheDocument();
  });

  test("모달이 클릭한 메뉴 아이템의 우측에 표시되는지 확인", () => {
    render(<LNB items={mockItems} />);

    // 상위 메뉴 클릭
    const menuItem = screen.getByText("상위메뉴1");
    userEvent.click(menuItem);

    // 모달이 표시되어야 함
    const modal = screen.getByTestId("lnb-modal");

    // 모달의 위치가 메뉴 아이템의 우측에 있는지 확인
    // getBoundingClientRect는 Jest 환경에서 정확한 값을 반환하지 않을 수 있으므로
    // 모달에 적용된 스타일 클래스를 확인
    expect(modal).toHaveClass("lnb-modal-right");
  });

  test("모달 외부 클릭 시 모달이 닫히는지 확인", () => {
    render(<LNB items={mockItems} />);

    // 상위 메뉴 클릭하여 모달 열기
    userEvent.click(screen.getByText("상위메뉴1"));

    // 모달이 표시되어야 함
    expect(screen.getByTestId("lnb-modal")).toBeInTheDocument();

    // 모달 외부 클릭 (document.body에 클릭 이벤트 발생)
    userEvent.click(document.body);

    // 모달이 닫혀야 함
    expect(screen.queryByTestId("lnb-modal")).not.toBeInTheDocument();
  });

  test("메뉴 아이템 선택 시 onSelect 콜백이 호출되는지 확인", () => {
    const mockOnSelect = jest.fn();
    render(<LNB items={mockItems} onSelect={mockOnSelect} />);

    // 상위 메뉴 클릭
    userEvent.click(screen.getByText("상위메뉴1"));

    // 하위 메뉴 클릭
    userEvent.click(screen.getByText("하위메뉴1-2"));

    // onSelect 콜백이 호출되어야 함
    expect(mockOnSelect).toHaveBeenCalledWith("1-2", expect.anything());
  });

  test("화면 하단에 있는 메뉴 아이템 클릭 시 모달이 위쪽으로 표시되는지 확인", () => {
    // 모의 환경에서 메뉴 아이템이 화면 하단에 있는 상황을 시뮬레이션
    // Element.getBoundingClientRect를 모킹하여 화면 하단에 위치한 것처럼 설정
    const originalGetBoundingClientRect =
      Element.prototype.getBoundingClientRect;

    // 마지막 메뉴 아이템이 화면 하단에 위치하도록 모킹
    const mockRect = {
      bottom: window.innerHeight - 10, // 화면 하단에서 10px 위
      top: window.innerHeight - 40,
      left: 10,
      right: 100,
      width: 90,
      height: 30,
    };

    // getBoundingClientRect 메서드를 모킹
    Element.prototype.getBoundingClientRect = jest
      .fn()
      .mockImplementation(function (this: Element) {
        // 특정 요소(마지막 메뉴 아이템)에 대해서만 모킹된 값을 반환
        if (this.textContent === "상위메뉴2") {
          return mockRect;
        }
        // 다른 요소에 대해서는 기본 구현 사용
        return originalGetBoundingClientRect.apply(this);
      });

    try {
      render(<LNB items={mockItems} />);

      // 화면 하단에 있는 메뉴 아이템 클릭
      userEvent.click(screen.getByText("상위메뉴2"));

      // 모달이 표시되어야 함
      const modal = screen.getByTestId("lnb-modal");
      expect(modal).toBeInTheDocument();

      // 모달이 위쪽으로 표시되어야 함 (lnb-modal-top 클래스가 적용되어야 함)
      expect(modal).toHaveClass("lnb-modal-top");
    } finally {
      // 테스트 후 원래 메서드 복원
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    }
  });
});
