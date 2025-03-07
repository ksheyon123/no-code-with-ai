import React, { ChangeEvent } from "react";
import "./Radio.css";

interface RadioProps {
  name: string;
  value: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Radio: React.FC<RadioProps> = ({
  name,
  value,
  label,
  checked = false,
  disabled = false,
  className = "",
  onChange,
}) => {
  return (
    <div
      className={`radio-container ${className}`}
      data-testid="radio-container"
    >
      <label className={`radio-label ${disabled ? "disabled" : ""}`}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          data-testid="radio"
          className="radio-input"
        />
        <span className="radio-custom"></span>
        {label && <span className="radio-text">{label}</span>}
      </label>
    </div>
  );
};

export default Radio;
