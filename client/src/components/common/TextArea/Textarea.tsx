import React, { InputHTMLAttributes } from "react";
import "./Textarea.css";

export interface ITextAreaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  /**
   * 입력 필드의 값
   */
  value?: string;
  /**
   * 입력 필드의 기본 값
   */
  defaultValue?: string;
  /**
   * 값 변경 이벤트 핸들러
   */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * 입력 필드에 적용할 추가 클래스명
   */
  className?: string;
  /**
   * 입력 필드의 비활성화 여부
   * @default false
   */
  disabled?: boolean;
  /**
   * 입력 필드의 읽기 전용 여부
   * @default false
   */
  readOnly?: boolean;
}

/**
 * 기본 Input 컴포넌트
 *
 * 기본적인 입력 필드 기능을 제공합니다.
 */
const TextArea: React.FC<ITextAreaProps> = ({
  value,
  defaultValue,
  onChange = () => {},
  className = "",
  disabled = false,
  readOnly = false,
  ...restProps
}) => {
  return (
    <textarea
      data-testid="textarea"
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className={`textarea ${className}`}
      disabled={disabled}
      readOnly={readOnly}
      {...restProps}
    />
  );
};

export default TextArea;
