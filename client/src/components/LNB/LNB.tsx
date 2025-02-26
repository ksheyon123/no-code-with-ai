import React, { useState, useRef, useEffect } from "react";
import styles from "./LNB.module.css";

// 메뉴 아이템 타입 정의
interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
  onClick?: () => void;
}

// LNB 컴포넌트 props 타입 정의
interface LNBProps {
  items?: MenuItem[];
  className?: string;
  onSelect?: (id: string, item: MenuItem) => void;
}

// 모달 컴포넌트 props 타입 정의
interface ModalProps {
  items: MenuItem[];
  parentRef: React.RefObject<HTMLElement>;
  onItemClick: (item: MenuItem) => void;
  onClose: () => void;
  level: number;
}

// 모달 컴포넌트
const Modal: React.FC<ModalProps> = ({
  items,
  parentRef,
  onItemClick,
  onClose,
  level,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"right" | "top">("right");

  // 모달 위치 계산
  useEffect(() => {
    if (modalRef.current && parentRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();

      // 화면 하단에 가까운 경우 모달을 위쪽에 표시
      if (parentRect.bottom + modalRect.height > window.innerHeight) {
        setPosition("top");
      } else {
        setPosition("right");
      }
    }
  }, []);

  // 모달 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className={`${styles["lnb-modal"]} ${styles[`lnb-modal-${position}`]}`}
      data-testid="lnb-modal"
      style={{ zIndex: 1000 + level }}
    >
      <ul className={styles["lnb-menu"]}>
        {items.map((item) => (
          <li
            key={item.id}
            className={styles["lnb-menu-item"]}
            onClick={() => onItemClick(item)}
          >
            {item.icon && (
              <span
                className={styles["lnb-menu-item-icon"]}
                data-testid={`icon-${item.icon}`}
              >
                {item.icon}
              </span>
            )}
            <span className={styles["lnb-menu-item-label"]}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// LNB 컴포넌트
const LNB: React.FC<LNBProps> = ({ items = [], className = "", onSelect }) => {
  // 열린 모달 상태 관리
  const [openModals, setOpenModals] = useState<
    Array<{
      parentId: string;
      items: MenuItem[];
      ref: React.RefObject<HTMLLIElement>;
    }>
  >([]);

  // 메뉴 아이템 클릭 핸들러
  const handleItemClick = (
    item: MenuItem,
    ref: React.RefObject<HTMLLIElement>
  ) => {
    // 자식 메뉴가 있는 경우
    if (item.children && item.children.length > 0) {
      // 이미 열린 모달인지 확인
      const isOpen = openModals.some((modal) => modal.parentId === item.id);

      if (isOpen) {
        // 이미 열린 모달이면 닫기
        setOpenModals(openModals.filter((modal) => modal.parentId !== item.id));
      } else {
        // 새 모달 열기
        const newModal = {
          parentId: item.id,
          items: item.children,
          ref,
        };

        // 현재 아이템의 레벨보다 깊은 모달은 모두 닫기
        const currentLevel = getItemLevel(item.id, items);
        const filteredModals = openModals.filter((modal) => {
          const modalLevel = getItemLevel(modal.parentId, items);
          return modalLevel <= currentLevel;
        });

        setOpenModals([...filteredModals, newModal]);
      }
    } else {
      // 자식 메뉴가 없는 경우 선택 이벤트 발생
      if (onSelect) {
        onSelect(item.id, item);
      }

      // 사용자 정의 클릭 핸들러가 있으면 호출
      if (item.onClick) {
        item.onClick();
      }

      // 모든 모달 닫기
      setOpenModals([]);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = (parentId: string) => {
    setOpenModals(openModals.filter((modal) => modal.parentId !== parentId));
  };

  // 아이템의 레벨 찾기 (재귀 함수)
  const getItemLevel = (
    itemId: string,
    menuItems: MenuItem[],
    level = 0
  ): number => {
    for (const item of menuItems) {
      if (item.id === itemId) {
        return level;
      }
      if (item.children) {
        const foundLevel = getItemLevel(itemId, item.children, level + 1);
        if (foundLevel > level) {
          return foundLevel;
        }
      }
    }
    return level;
  };

  // 메뉴 아이템 렌더링 (재귀 함수)
  const renderMenuItem = (item: MenuItem) => {
    const ref = useRef<HTMLLIElement>(null);

    return (
      <li
        key={item.id}
        ref={ref}
        className={styles["lnb-menu-item"]}
        onClick={() => handleItemClick(item, ref)}
      >
        {item.icon && (
          <span
            className={styles["lnb-menu-item-icon"]}
            data-testid={`icon-${item.icon}`}
          >
            {item.icon}
          </span>
        )}
        <span className={styles["lnb-menu-item-label"]}>{item.label}</span>
      </li>
    );
  };

  return (
    <nav className={`${styles.lnb} ${className}`} data-testid="lnb">
      <ul className={styles["lnb-menu"]}>
        {items.map((item) => renderMenuItem(item))}
      </ul>

      {/* 모달 렌더링 */}
      {openModals.map((modal, index) => (
        <Modal
          key={modal.parentId}
          items={modal.items}
          parentRef={modal.ref}
          onItemClick={(item) => handleItemClick(item, modal.ref)}
          onClose={() => handleCloseModal(modal.parentId)}
          level={index + 1}
        />
      ))}
    </nav>
  );
};

export default LNB;
