import React, { ReactElement } from "react";
import "./InputWrapper.css";

export interface IInputWrapperProps {
  /**
   * 입력 필드의 라벨
   */
  label?: string;
  /**
   * 에러 메시지
   */
  errorTxt?: string;
  /**
   * 도움말 텍스트
   */
  helperTxt?: string;
  /**
   * 필수 입력 여부
   * @default false
   */
  required?: boolean;
  /**
   * 입력 필드 래퍼에 적용할 추가 클래스명
   */
  className?: string;
  /**
   * 자식 컴포넌트 (Input)
   */
  children: ReactElement;
}

/**
 * InputWrapper 컴포넌트
 *
 * Input 컴포넌트를 감싸고 라벨, 에러 메시지, 도움말 등을 표시합니다.
 */
const InputWrapper: React.FC<IInputWrapperProps> = ({
  label,
  errorTxt,
  helperTxt,
  required = false,
  className = "",
  children,
}) => {
  return (
    <div data-testid="input-wrapper" className={`input-wrapper ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && (
            <span data-testid="required-mark" className="required-mark">
              *
            </span>
          )}
        </label>
      )}
      <div className={`input-container ${errorTxt ? "error" : ""}`}>
        {children}
      </div>
      {errorTxt && <div className="error-text">{errorTxt}</div>}
      {helperTxt && <div className="helper-text">{helperTxt}</div>}
    </div>
  );
};

export default InputWrapper;
