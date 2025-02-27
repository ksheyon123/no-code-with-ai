import React, { useState } from "react";

export interface DrawerProps {
  /**
   * Drawer의 제목
   */
  title?: string;
  /**
   * Drawer의 초기 열림 상태
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Drawer에 적용할 추가 클래스명
   */
  className?: string;
  /**
   * Drawer 내부에 표시할 내용
   */
  children: React.ReactNode;
}

/**
 * Drawer 컴포넌트
 *
 * 클릭 시 열리고 재클릭 시 닫히는 UI 컴포넌트입니다.
 */
const Drawer: React.FC<DrawerProps> = ({
  title,
  defaultOpen = false,
  className = "",
  children,
}) => {
  // 열림/닫힘 상태 관리
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // 헤더 클릭 핸들러
  const handleHeaderClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      data-testid="drawer"
      data-state={isOpen ? "open" : "closed"}
      className={`drawer ${className}`}
    >
      <div
        data-testid="drawer-header"
        className="drawer-header"
        onClick={handleHeaderClick}
      >
        {title && <div className="drawer-title">{title}</div>}
        <div className="drawer-icon">{isOpen ? "▼" : "▶"}</div>
      </div>
      <div
        data-testid="drawer-content"
        className="drawer-content"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Drawer;
