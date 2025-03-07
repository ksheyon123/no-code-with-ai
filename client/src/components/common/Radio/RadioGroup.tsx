import React, {
  ReactElement,
  cloneElement,
  ChangeEvent,
  useState,
} from "react";
import Radio from "./Radio";
import "./RadioGroup.css";

interface RadioGroupProps {
  name: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  direction?: "horizontal" | "vertical";
  onChange?: (value: string) => void;
  children:
    | ReactElement<React.ComponentProps<typeof Radio>>
    | ReactElement<React.ComponentProps<typeof Radio>>[];
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  disabled = false,
  className = "",
  direction = "horizontal",
  onChange,
  children,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const directionClass = `radio-group-${direction}`;

  // React.Children.map을 사용하여 각 Radio 컴포넌트에 필요한 props를 전달
  const radioButtons = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    // 각 Radio 컴포넌트에 필요한 props 전달
    return cloneElement(child, {
      name, // RadioGroup의 name을 모든 Radio에 전달
      checked: value === child.props.value,
      disabled: disabled || child.props.disabled,
      onChange: handleChange,
    } as React.ComponentProps<typeof Radio>);
  });

  return (
    <div
      className={`radio-group ${directionClass} ${className}`}
      data-testid="radio-group"
    >
      {radioButtons}
    </div>
  );
};

export default RadioGroup;
