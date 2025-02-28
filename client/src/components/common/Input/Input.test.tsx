import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

describe("Input 컴포넌트", () => {
  // Input 컴포넌트가 렌더링되는지 확인
  it("Input 컴포넌트가 렌더링된다", () => {
    render(<Input />);

    // Input 요소가 존재하는지 확인
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toBeInTheDocument();
  });

  // placeholder 속성이 제대로 적용되는지 확인
  it("placeholder prop이 전달되면 placeholder가 표시된다", () => {
    const placeholder = "텍스트를 입력하세요";
    render(<Input placeholder={placeholder} />);

    // placeholder가 적용되었는지 확인
    const inputElement = screen.getByPlaceholderText(placeholder);
    expect(inputElement).toBeInTheDocument();
  });

  // value 속성이 제대로 적용되는지 확인
  it("value prop이 전달되면 해당 값이 표시된다", () => {
    const value = "테스트 값";
    render(<Input value={value} />);

    // value가 적용되었는지 확인
    const inputElement = screen.getByDisplayValue(value);
    expect(inputElement).toBeInTheDocument();
  });

  // onChange 이벤트가 제대로 동작하는지 확인
  it("텍스트 입력 시 onChange 이벤트가 호출된다", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);

    // Input 요소 찾기
    const inputElement = screen.getByTestId("input");

    // 텍스트 입력
    await user.type(inputElement, "테스트");

    // onChange 이벤트가 호출되었는지 확인
    expect(handleChange).toHaveBeenCalled();
  });

  // disabled 속성이 제대로 적용되는지 확인
  it("disabled prop이 true이면 입력이 비활성화된다", () => {
    render(<Input disabled={true} />);

    // Input 요소가 비활성화되었는지 확인
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toBeDisabled();
  });

  // readOnly 속성이 제대로 적용되는지 확인
  it("readOnly prop이 true이면 읽기 전용 상태가 된다", () => {
    render(<Input readOnly={true} />);

    // Input 요소가 읽기 전용인지 확인
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toHaveAttribute("readOnly");
  });

  // className 속성이 제대로 적용되는지 확인
  it("className prop이 전달되면 해당 클래스가 적용된다", () => {
    const customClass = "custom-input";
    render(<Input className={customClass} />);

    // 커스텀 클래스가 적용되었는지 확인
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toHaveClass(customClass);
  });

  // type 속성이 제대로 적용되는지 확인
  it("type prop이 전달되면 해당 타입이 적용된다", () => {
    render(<Input type="password" />);

    // type이 적용되었는지 확인
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toHaveAttribute("type", "password");
  });
});
