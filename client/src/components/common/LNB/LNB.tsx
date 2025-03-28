import React, { ReactNode, useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaToolbox } from "react-icons/fa";
import { FiLayout } from "react-icons/fi";

// LNB 아이콘 컴포넌트 인터페이스
interface LNBIconProps {
  /**
   * 아이콘 ID (상태 관리용 고유 식별자)
   */
  id: string;
  /**
   * 아이콘 컴포넌트
   */
  icon: React.ReactNode;
  /**
   * 현재 활성화된 아이콘 ID
   */
  activeIcon: string | null;
  /**
   * 현재 호버 중인 아이콘 ID
   */
  hoverIcon: string | null;
  /**
   * LNB가 열려있는지 여부
   */
  isOpen: boolean;
  /**
   * 아이콘 클릭 핸들러
   */
  onIconClick: (id: string) => void;
  /**
   * 아이콘 호버 시작 핸들러
   */
  onIconHoverStart: (id: string) => void;
  /**
   * 아이콘 호버 종료 핸들러
   */
  onIconHoverEnd: () => void;
}

/**
 * LNB 아이콘 컴포넌트
 *
 * LNB에 표시되는 아이콘을 렌더링하는 컴포넌트입니다.
 * 아이콘의 활성화 상태와 호버 상태에 따라 스타일이 변경됩니다.
 */
const LNBIcon: React.FC<LNBIconProps> = ({
  id,
  icon,
  activeIcon,
  hoverIcon,
  isOpen,
  onIconClick,
  onIconHoverStart,
  onIconHoverEnd,
}) => {
  return (
    <div
      onClick={() => !isOpen && onIconClick(id)}
      onMouseEnter={() => !isOpen && onIconHoverStart(id)}
      onMouseLeave={onIconHoverEnd}
      style={{
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            !isOpen && activeIcon === id
              ? "#ed7470"
              : !isOpen && hoverIcon === id
              ? "rgba(237, 116, 112, 0.6)"
              : "transparent",
          transition: "background-color 0.2s",
        }}
      >
        {icon}
      </div>
    </div>
  );
};

export interface ILNBProps {
  /**
   * LNB의 제목
   */
  title?: string | ReactNode;
  /**
   * LNB의 초기 열림 상태
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * LNB에 적용할 추가 클래스명
   */
  className?: string;
  /**
   * LNB 내부에 표시할 내용
   */
  children: React.ReactNode;
  /**
   * LNB의 최대 너비 (픽셀 단위)
   * @default 250
   */
  maxWidth?: number;
  /**
   * LNB의 최소 너비 (픽셀 단위, 닫혔을 때)
   * @default 60
   */
  minWidth?: number;
  /**
   * 토글 버튼 아이콘 (열린 상태)
   * @default "◀"
   */
  openIcon?: ReactNode;
  /**
   * 토글 버튼 아이콘 (닫힌 상태)
   * @default "▶"
   */
  closeIcon?: ReactNode;
}

/**
 * LNB(Left Navigation Bar) 컴포넌트
 *
 * 왼쪽에 위치하며 열고 닫을 수 있는 네비게이션 바 컴포넌트입니다.
 * 열린 상태와 닫힌 상태에 따라 너비가 조절됩니다.
 */
const LNB: React.FC<ILNBProps> = ({
  title,
  defaultOpen = false,
  className = "",
  children,
  maxWidth = 250,
  minWidth = 60,
  openIcon = "◀",
  closeIcon = "▶",
}) => {
  // 열림/닫힘 상태 관리
  const [isOpen, setIsOpen] = useState(defaultOpen);
  // 아이콘 활성화 상태 관리
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  // hover 상태 관리
  const [hoverIcon, setHoverIcon] = useState<string | null>(null);
  const lnbRef = useRef<HTMLDivElement>(null);

  // 토글 버튼 클릭 핸들러
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // 스타일 계산
  const lnbStyle = {
    width: isOpen ? `${maxWidth}px` : `${minWidth}px`,
  };

  // 외부 클릭 시 LNB 닫기 (선택적 기능)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        lnbRef.current &&
        !lnbRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        // 외부 클릭 시 닫기 기능을 원하면 아래 주석을 해제
        // setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={lnbRef}
      data-testid="lnb"
      data-state={isOpen ? "open" : "closed"}
      className={`lnb ${className}`}
      style={{
        ...lnbStyle,
        height: "100%",
        backgroundColor: "#FFF",
        borderRight: "3px solid #ddd",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* LNB 토글 버튼 */}
      <button
        className="lnb-toggle"
        onClick={handleToggle}
        style={{
          border: "none",
          background: "transparent",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "60px",
          height: "60px",
          cursor: "pointer",
        }}
      >
        {isOpen ? <FaArrowLeft size={24} /> : <FaArrowRight size={24} />}
      </button>

      {/* LNB 내용 */}
      <div
        data-testid="lnb-content"
        className="lnb-content"
        style={{
          flex: 1,
          overflow: "auto",
          padding: isOpen ? "15px" : "0",
        }}
      >
        {/* 아이콘 목록 */}
        <LNBIcon
          id="layout"
          icon={<FiLayout size={24} />}
          activeIcon={activeIcon}
          hoverIcon={hoverIcon}
          isOpen={isOpen}
          onIconClick={(id) => setActiveIcon(activeIcon === id ? null : id)}
          onIconHoverStart={(id) => setHoverIcon(id)}
          onIconHoverEnd={() => setHoverIcon(null)}
        />

        <LNBIcon
          id="toolbox"
          icon={<FaToolbox size={24} />}
          activeIcon={activeIcon}
          hoverIcon={hoverIcon}
          isOpen={isOpen}
          onIconClick={(id) => setActiveIcon(activeIcon === id ? null : id)}
          onIconHoverStart={(id) => setHoverIcon(id)}
          onIconHoverEnd={() => setHoverIcon(null)}
        />
      </div>
    </div>
  );
};

export default LNB;
