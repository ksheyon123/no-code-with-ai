import { render, screen } from "@testing-library/react";
import InputWrapper from "./InputWrapper";
import Input from "./Input";

describe("InputWrapper 컴포넌트", () => {
  // InputWrapper 컴포넌트가 렌더링되는지 확인
  it("InputWrapper 컴포넌트가 렌더링된다", () => {
    render(
      <InputWrapper>
        <Input />
      </InputWrapper>
    );

    // InputWrapper 요소가 존재하는지 확인
    const wrapperElement = screen.getByTestId("input-wrapper");
    expect(wrapperElement).toBeInTheDocument();
  });

  // label 속성이 제대로 적용되는지 확인
  it("label prop이 전달되면 라벨이 표시된다", () => {
    const label = "이름";
    render(
      <InputWrapper label={label}>
        <Input />
      </InputWrapper>
    );

    // 라벨이 표시되는지 확인
    const labelElement = screen.getByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  // errorTxt 속성이 제대로 적용되는지 확인
  it("errorTxt prop이 전달되면 에러 메시지가 표시된다", () => {
    const errorTxt = "필수 입력 항목입니다";
    render(
      <InputWrapper errorTxt={errorTxt}>
        <Input />
      </InputWrapper>
    );

    // 에러 메시지가 표시되는지 확인
    const errorElement = screen.getByText(errorTxt);
    expect(errorElement).toBeInTheDocument();
  });

  // required 속성이 제대로 적용되는지 확인
  it("required prop이 true이면 필수 표시가 나타난다", () => {
    render(
      <InputWrapper label="이름" required={true}>
        <Input />
      </InputWrapper>
    );

    // 필수 표시가 나타나는지 확인
    const requiredMark = screen.getByTestId("required-mark");
    expect(requiredMark).toBeInTheDocument();
  });

  // className 속성이 제대로 적용되는지 확인
  it("className prop이 전달되면 해당 클래스가 적용된다", () => {
    const customClass = "custom-wrapper";
    render(
      <InputWrapper className={customClass}>
        <Input />
      </InputWrapper>
    );

    // 커스텀 클래스가 적용되었는지 확인
    const wrapperElement = screen.getByTestId("input-wrapper");
    expect(wrapperElement).toHaveClass(customClass);
  });

  // 자식 컴포넌트가 제대로 렌더링되는지 확인
  it("children prop으로 전달된 Input 컴포넌트가 렌더링된다", () => {
    render(
      <InputWrapper>
        <Input data-testid="test-input" />
      </InputWrapper>
    );

    // Input 컴포넌트가 렌더링되었는지 확인
    const inputElement = screen.getByTestId("test-input");
    expect(inputElement).toBeInTheDocument();
  });

  // helperTxt 속성이 제대로 적용되는지 확인
  it("helperTxt prop이 전달되면 도움말이 표시된다", () => {
    const helperTxt = "영문, 숫자 조합 8-20자";
    render(
      <InputWrapper helperTxt={helperTxt}>
        <Input />
      </InputWrapper>
    );

    // 도움말이 표시되는지 확인
    const helperElement = screen.getByText(helperTxt);
    expect(helperElement).toBeInTheDocument();
  });

  // errorTxt가 있을 때 input-container에 에러 스타일이 적용되는지 확인
  it("errorTxt prop이 있으면 input-container에 에러 스타일이 적용된다", () => {
    render(
      <InputWrapper errorTxt="에러 메시지">
        <Input />
      </InputWrapper>
    );

    // input-container 요소에 에러 클래스가 적용되었는지 확인
    const containerElement = screen
      .getByTestId("input-wrapper")
      .querySelector(".input-container");
    expect(containerElement).toHaveClass("error");
  });
});
