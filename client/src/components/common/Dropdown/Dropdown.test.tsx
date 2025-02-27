import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Dropdown from "./Dropdown";

describe("Dropdown", () => {
  const mockItems = [
    { id: "1", label: "옵션 1" },
    { id: "2", label: "옵션 2" },
    { id: "3", label: "옵션 3" },
  ];

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("렌더링 시 기본 상태에서는 목록이 보이지 않아야 함", () => {
    render(<Dropdown items={mockItems} onClick={mockOnClick} />);

    // 드롭다운 버튼은 보여야 함
    expect(screen.getByRole("button")).toBeInTheDocument();

    // 드롭다운 메뉴(목록)는 보이지 않아야 함
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("드롭다운 버튼 클릭 시 목록이 표시되어야 함", async () => {
    const user = userEvent.setup();
    render(<Dropdown items={mockItems} onClick={mockOnClick} />);

    // 드롭다운 버튼 클릭
    await user.click(screen.getByRole("button"));

    // 드롭다운 메뉴(목록)가 보여야 함
    const dropdownMenu = screen.getByTestId("dropdown-menu");
    expect(dropdownMenu).toBeInTheDocument();

    // 모든 아이템이 목록에 표시되어야 함
    mockItems.forEach((item) => {
      const menuItem = within(dropdownMenu).getByText(item.label);
      expect(menuItem).toBeVisible();
    });
  });

  it("목록 아이템 클릭 시 선택된 아이템이 변경되고 목록이 닫혀야 함", async () => {
    const user = userEvent.setup();
    render(<Dropdown items={mockItems} onClick={mockOnClick} />);

    // 초기 상태에서는 첫 번째 아이템이 선택되어 있어야 함
    expect(screen.getByRole("button")).toHaveTextContent(mockItems[0].label);

    // 드롭다운 버튼 클릭
    await user.click(screen.getByRole("button"));

    // 드롭다운 메뉴가 열려야 함
    const dropdownMenu = screen.getByTestId("dropdown-menu");

    // 두 번째 아이템 클릭
    await user.click(within(dropdownMenu).getByText(mockItems[1].label));

    // 선택된 아이템이 변경되어야 함
    expect(screen.getByRole("button")).toHaveTextContent(mockItems[1].label);

    // 목록이 닫혀야 함
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();

    // onClick 콜백이 호출되어야 함
    expect(mockOnClick).toHaveBeenCalledWith(mockItems[1]);
  });

  it("defaultValue prop이 제공되면 해당 아이템이 초기 선택되어야 함", () => {
    render(
      <Dropdown
        items={mockItems}
        onClick={mockOnClick}
        defaultValue={mockItems[2].id}
      />
    );

    // defaultValue에 해당하는 아이템이 선택되어 있어야 함
    expect(screen.getByRole("button")).toHaveTextContent(mockItems[2].label);
  });

  it("외부 영역 클릭 시 목록이 닫혀야 함", async () => {
    const user = userEvent.setup();
    render(<Dropdown items={mockItems} onClick={mockOnClick} />);

    // 드롭다운 버튼 클릭
    await user.click(screen.getByRole("button"));

    // 목록이 보여야 함
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();

    // 외부 영역 클릭 (body에 클릭 이벤트 발생)
    await user.click(document.body);

    // 목록이 닫혀야 함
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });
});
