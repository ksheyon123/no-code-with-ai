import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio, RadioGroup } from "./index";

describe("RadioGroup 컴포넌트", () => {
  // RadioGroup 컴포넌트가 렌더링되는지 확인
  it("RadioGroup 컴포넌트가 렌더링된다", () => {
    render(
      <RadioGroup name="test-group">
        <Radio name="test-group" value="option1" label="옵션 1" />
        <Radio name="test-group" value="option2" label="옵션 2" />
      </RadioGroup>
    );

    // RadioGroup 요소가 존재하는지 확인
    const radioGroupElement = screen.getByTestId("radio-group");
    expect(radioGroupElement).toBeInTheDocument();
  });

  // 자식 Radio 컴포넌트들이 렌더링되는지 확인
  it("자식 Radio 컴포넌트들이 렌더링된다", () => {
    render(
      <RadioGroup name="test-group">
        <Radio name="test-group" value="option1" label="옵션 1" />
        <Radio name="test-group" value="option2" label="옵션 2" />
      </RadioGroup>
    );

    // Radio 요소들이 존재하는지 확인
    const radioElements = screen.getAllByTestId("radio");
    expect(radioElements.length).toBe(2);
  });

  // value 속성이 제대로 적용되는지 확인
  it("value prop이 전달되면 해당 Radio가 선택된다", () => {
    render(
      <RadioGroup name="test-group" value="option2">
        <Radio name="test-group" value="option1" label="옵션 1" />
        <Radio name="test-group" value="option2" label="옵션 2" />
      </RadioGroup>
    );

    // Radio 요소들 찾기
    const radioElements = screen.getAllByTestId("radio");

    // 첫 번째 Radio는 선택되지 않았는지 확인
    expect(radioElements[0]).not.toBeChecked();

    // 두 번째 Radio는 선택되었는지 확인
    expect(radioElements[1]).toBeChecked();
  });

  // onChange 이벤트가 제대로 동작하는지 확인
  it("Radio 클릭 시 onChange 이벤트가 호출된다", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <RadioGroup name="test-group" onChange={handleChange}>
        <Radio name="test-group" value="option1" label="옵션 1" />
        <Radio name="test-group" value="option2" label="옵션 2" />
      </RadioGroup>
    );

    // 두 번째 Radio 요소 찾기
    const radioElements = screen.getAllByTestId("radio");
    const secondRadio = radioElements[1];

    // Radio 클릭
    await user.click(secondRadio);

    // onChange 이벤트가 호출되었는지 확인
    expect(handleChange).toHaveBeenCalledWith("option2");
  });

  // disabled 속성이 제대로 적용되는지 확인
  it("disabled prop이 true이면 모든 Radio가 비활성화된다", () => {
    render(
      <RadioGroup name="test-group" disabled={true}>
        <Radio name="test-group" value="option1" label="옵션 1" />
        <Radio name="test-group" value="option2" label="옵션 2" />
      </RadioGroup>
    );

    // Radio 요소들이 비활성화되었는지 확인
    const radioElements = screen.getAllByTestId("radio");
    radioElements.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  // className 속성이 제대로 적용되는지 확인
  it("className prop이 전달되면 해당 클래스가 적용된다", () => {
    const customClass = "custom-radio-group";
    render(
      <RadioGroup name="test-group" className={customClass}>
        <Radio name="test-group" value="option1" label="옵션 1" />
        <Radio name="test-group" value="option2" label="옵션 2" />
      </RadioGroup>
    );

    // 커스텀 클래스가 적용되었는지 확인
    const radioGroupElement = screen.getByTestId("radio-group");
    expect(radioGroupElement).toHaveClass(customClass);
  });

  // 방향 속성이 제대로 적용되는지 확인
  it("direction prop이 vertical이면 세로 방향으로 정렬된다", () => {
    render(
      <RadioGroup name="test-group" direction="vertical">
        <Radio name="test-group" value="option1" label="옵션 1" />
        <Radio name="test-group" value="option2" label="옵션 2" />
      </RadioGroup>
    );

    // 세로 방향 클래스가 적용되었는지 확인
    const radioGroupElement = screen.getByTestId("radio-group");
    expect(radioGroupElement).toHaveClass("radio-group-vertical");
  });

  // 기본 방향이 가로인지 확인
  it("direction prop이 없으면 기본적으로 가로 방향으로 정렬된다", () => {
    render(
      <RadioGroup name="test-group">
        <Radio name="test-group" value="option1" label="옵션 1" />
        <Radio name="test-group" value="option2" label="옵션 2" />
      </RadioGroup>
    );

    // 가로 방향 클래스가 적용되었는지 확인
    const radioGroupElement = screen.getByTestId("radio-group");
    expect(radioGroupElement).toHaveClass("radio-group-horizontal");
  });
});
