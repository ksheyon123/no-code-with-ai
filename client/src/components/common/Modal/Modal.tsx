import React, { ReactNode } from "react";
import { useModalContext } from "@/contexts/ModalContext";
import "./Modal.css";
import { ElementGenerationParams } from "@/types";

// 모달 컴포넌트 Props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

// 메인 Modal 컴포넌트
const Modal: React.FC<ModalProps> & {
  Backdrop: typeof ModalBackdrop;
  Header: typeof ModalHeader;
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
} = ({ isOpen, onClose, children, className = "" }) => {
  const { setModalState } = useModalContext();
  if (!isOpen) return null;
  return (
    <div
      className={`modal-container ${className}`}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
};

// Backdrop 컴포넌트
interface BackdropProps {
  onClick?: () => void;
  className?: string;
}

const ModalBackdrop: React.FC<BackdropProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`modal-backdrop ${className}`}
      onClick={onClick}
      data-testid="modal-backdrop"
    />
  );
};

// Header 컴포넌트
interface HeaderProps {
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  style?: React.CSSProperties;
}

const ModalHeader: React.FC<HeaderProps> = ({
  children,
  className = "",
  onClose,
  showCloseButton = true,
  style,
}) => {
  return (
    <div
      className={`modal-header ${className}`}
      data-testid="modal-header"
      style={style}
    >
      {children}
      {showCloseButton && onClose && (
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="닫기"
          data-testid="modal-close-button"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Content 컴포넌트
interface ContentProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ModalContent: React.FC<ContentProps> = ({
  children,
  className = "",
  style,
}) => {
  const { modalState, setModalState } =
    useModalContext<ElementGenerationParams>();

  return (
    <div
      className={`modal-content ${className}`}
      data-testid="modal-content"
      style={style}
    >
      {children}
    </div>
  );
};

// Footer 컴포넌트
interface FooterProps {
  children: ReactNode | ((state: Record<string, any>) => ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

const ModalFooter: React.FC<FooterProps> = ({
  children,
  className = "",
  style,
}) => {
  const { modalState } = useModalContext<ElementGenerationParams>();

  return (
    <div
      className={`modal-footer ${className}`}
      data-testid="modal-footer"
      style={style}
    >
      {typeof children === "function" ? children(modalState) : children}
    </div>
  );
};

// Compound Components 패턴 구성
Modal.Backdrop = ModalBackdrop;
Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
