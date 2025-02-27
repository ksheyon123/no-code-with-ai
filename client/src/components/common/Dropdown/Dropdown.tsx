import React, { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

export type DropdownItem = {
  id: string;
  label: string;
  [key: string]: any;
};

interface DropdownProps {
  items: DropdownItem[];
  onClick: (item: DropdownItem) => void;
  defaultValue?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  onClick,
  defaultValue,
}) => {
  // 초기 선택 아이템 설정
  const getInitialSelectedItem = () => {
    if (defaultValue) {
      const defaultItem = items.find((item) => item.id === defaultValue);
      return defaultItem || items[0];
    }
    return items[0];
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem>(
    getInitialSelectedItem()
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지를 위한 이벤트 리스너
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 아이템 선택 처리
  const handleItemClick = (item: DropdownItem) => {
    setSelectedItem(item);
    setIsOpen(false);
    onClick(item);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="dropdown-toggle"
        data-testid="dropdown-toggle"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {selectedItem.label}
      </button>

      {isOpen && (
        <ul data-testid="dropdown-menu" className="dropdown-menu">
          {items.map((item) => (
            <li key={item.id} className="dropdown-item">
              <button
                type="button"
                onClick={() => handleItemClick(item)}
                className={selectedItem.id === item.id ? "selected" : ""}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
