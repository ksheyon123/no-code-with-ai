import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Drawer from "./Drawer";

describe("Drawer 컴포넌트", () => {
  // Drawer 컴포넌트가 렌더링되는지 확인
  it("Drawer 컴포넌트가 렌더링된다", () => {
    render(<Drawer>내용</Drawer>);

    // Drawer 컨테이너가 존재하는지 확인
    const drawerElement = screen.getByTestId("drawer");
    expect(drawerElement).toBeInTheDocument();
  });

  // 초기 상태에서 Drawer가 닫혀 있는지 확인
  it("초기 상태에서 Drawer는 닫혀 있다", () => {
    render(<Drawer>내용</Drawer>);

    // Drawer 컨테이너가 닫힌 상태인지 확인
    const drawerElement = screen.getByTestId("drawer");
    expect(drawerElement).toHaveAttribute("data-state", "closed");

    // 내용이 보이지 않는지 확인
    const drawerContent = screen.getByTestId("drawer-content");
    expect(drawerContent).not.toBeVisible();
  });

  // 클릭 시 Drawer가 열리는지 확인
  it("Drawer 헤더 클릭 시 Drawer가 열린다", async () => {
    const user = userEvent.setup();
    render(<Drawer>내용</Drawer>);

    // Drawer 헤더 찾기
    const drawerHeader = screen.getByTestId("drawer-header");

    // 헤더 클릭
    await user.click(drawerHeader);

    // Drawer가 열린 상태인지 확인
    const drawerElement = screen.getByTestId("drawer");
    expect(drawerElement).toHaveAttribute("data-state", "open");

    // 내용이 보이는지 확인
    const drawerContent = screen.getByTestId("drawer-content");
    expect(drawerContent).toBeVisible();
  });

  // 열린 상태에서 다시 클릭 시 Drawer가 닫히는지 확인
  it("열린 상태에서 Drawer 헤더 재클릭 시 Drawer가 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Drawer>내용</Drawer>);

    // Drawer 헤더 찾기
    const drawerHeader = screen.getByTestId("drawer-header");

    // 헤더 클릭하여 열기
    await user.click(drawerHeader);

    // Drawer가 열린 상태인지 확인
    const drawerElement = screen.getByTestId("drawer");
    expect(drawerElement).toHaveAttribute("data-state", "open");

    // 헤더 다시 클릭하여 닫기
    await user.click(drawerHeader);

    // Drawer가 닫힌 상태인지 확인
    expect(drawerElement).toHaveAttribute("data-state", "closed");

    // 내용이 보이지 않는지 확인
    const drawerContent = screen.getByTestId("drawer-content");
    expect(drawerContent).not.toBeVisible();
  });

  // 제목 prop이 전달되면 제목이 표시되는지 확인
  it("title prop이 전달되면 제목이 표시된다", () => {
    const title = "Drawer 제목";
    render(<Drawer title={title}>내용</Drawer>);

    // 제목이 표시되는지 확인
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  // 기본 열림 상태 prop 테스트
  it("defaultOpen prop이 true이면 초기 상태가 열려있다", () => {
    render(<Drawer defaultOpen={true}>내용</Drawer>);

    // Drawer가 열린 상태인지 확인
    const drawerElement = screen.getByTestId("drawer");
    expect(drawerElement).toHaveAttribute("data-state", "open");

    // 내용이 보이는지 확인
    const drawerContent = screen.getByTestId("drawer-content");
    expect(drawerContent).toBeVisible();
  });

  // 커스텀 클래스 prop 테스트
  it("className prop이 전달되면 해당 클래스가 적용된다", () => {
    const customClass = "custom-drawer";
    render(<Drawer className={customClass}>내용</Drawer>);

    // 커스텀 클래스가 적용되었는지 확인
    const drawerElement = screen.getByTestId("drawer");
    expect(drawerElement).toHaveClass(customClass);
  });
});
