import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Radio from "./Radio";

describe("Radio 컴포넌트", () => {
  // Radio 컴포넌트가 렌더링되는지 확인
  it("Radio 컴포넌트가 렌더링된다", () => {
    render(<Radio name="test" value="option1" />);

    // Radio 요소가 존재하는지 확인
    const radioElement = screen.getByTestId("radio");
    expect(radioElement).toBeInTheDocument();
  });

  // label 속성이 제대로 적용되는지 확인
  it("label prop이 전달되면 라벨이 표시된다", () => {
    const label = "옵션 1";
    render(<Radio name="test" value="option1" label={label} />);

    // 라벨이 표시되는지 확인
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  // checked 속성이 제대로 적용되는지 확인
  it("checked prop이 true이면 선택된 상태가 된다", () => {
    render(<Radio name="test" value="option1" checked={true} />);

    // Radio 요소가 선택되었는지 확인
    const radioElement = screen.getByTestId("radio");
    expect(radioElement).toBeChecked();
  });

  // onChange 이벤트가 제대로 동작하는지 확인
  it("Radio 클릭 시 onChange 이벤트가 호출된다", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Radio name="test" value="option1" onChange={handleChange} />);

    // Radio 요소 찾기
    const radioElement = screen.getByTestId("radio");

    // Radio 클릭
    await user.click(radioElement);

    // onChange 이벤트가 호출되었는지 확인
    expect(handleChange).toHaveBeenCalled();
  });

  // disabled 속성이 제대로 적용되는지 확인
  it("disabled prop이 true이면 선택이 비활성화된다", () => {
    render(<Radio name="test" value="option1" disabled={true} />);

    // Radio 요소가 비활성화되었는지 확인
    const radioElement = screen.getByTestId("radio");
    expect(radioElement).toBeDisabled();
  });

  // disabled 상태에서 클릭 시 이벤트가 발생하지 않는지 확인
  it("disabled 상태에서 클릭 시 onChange 이벤트가 호출되지 않는다", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Radio
        name="test"
        value="option1"
        onChange={handleChange}
        disabled={true}
      />
    );

    // Radio 요소 찾기
    const radioElement = screen.getByTestId("radio");

    // Radio 클릭
    await user.click(radioElement);

    // onChange 이벤트가 호출되지 않았는지 확인
    expect(handleChange).not.toHaveBeenCalled();
  });

  // className 속성이 제대로 적용되는지 확인
  it("className prop이 전달되면 해당 클래스가 적용된다", () => {
    const customClass = "custom-radio";
    render(<Radio name="test" value="option1" className={customClass} />);

    // 커스텀 클래스가 적용되었는지 확인
    const radioContainer = screen.getByTestId("radio-container");
    expect(radioContainer).toHaveClass(customClass);
  });

  // name 속성이 제대로 적용되는지 확인
  it("name prop이 전달되면 해당 name이 적용된다", () => {
    const name = "test-group";
    render(<Radio name={name} value="option1" />);

    // name이 적용되었는지 확인
    const radioElement = screen.getByTestId("radio");
    expect(radioElement).toHaveAttribute("name", name);
  });

  // value 속성이 제대로 적용되는지 확인
  it("value prop이 전달되면 해당 value가 적용된다", () => {
    const value = "option1";
    render(<Radio name="test" value={value} />);

    // value가 적용되었는지 확인
    const radioElement = screen.getByTestId("radio");
    expect(radioElement).toHaveAttribute("value", value);
  });
});
