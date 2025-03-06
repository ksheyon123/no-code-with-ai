import React, { createContext, useContext, ReactNode } from "react";
import Modal from "@/components/common/Modal/Modal";
import { useModal } from "@/hooks/useModal";

interface ModalOptions {
  useHeader?: boolean;
  useFooter?: boolean;
  showCloseButton?: boolean;
  showNavigationButtons?: boolean;
  style?: {
    headerStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    footerStyle?: React.CSSProperties;
  };
  onPrevious?: () => void;
  onNext?: () => void;
}

interface ModalContextType {
  isOpen: boolean;
  modalContent: ReactNode | ReactNode[] | null;
  modalHeader: ReactNode | null;
  modalFooter: ReactNode | null;
  modalOptions: ModalOptions;
  modalState: Record<string, any>;
  setModalState: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  openModal: (
    content: ReactNode | ReactNode[],
    header?: ReactNode,
    footer?: ReactNode,
    options?: ModalOptions
  ) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error(
      "useModalContext must be used within a ModalContextProvider"
    );
  }
  return context;
};

interface ModalContextProviderProps {
  children: ReactNode;
}

export const ModalContextProvider: React.FC<ModalContextProviderProps> = ({
  children,
}) => {
  const {
    isOpen,
    modalContent,
    modalHeader,
    modalFooter,
    modalOptions,
    modalState,
    setModalState,
    modalStyle,
    curIdx,
    openModal,
    closeModal,
    onPrevious,
    onNext,
  } = useModal();

  const value = {
    isOpen,
    modalContent,
    modalHeader,
    modalFooter,
    modalOptions,
    modalState,
    curIdx,
    setModalState,
    openModal,
    closeModal,
    onPrevious,
    onNext,
  };

  // 모달 외부 클릭 시 닫기 처리
  const handleBackdropClick = () => {
    closeModal();
  };

  // 네비게이션 버튼 렌더링
  const renderNavigationButtons = () => {
    if (!modalOptions.showNavigationButtons) return null;

    return (
      <>
        {!!onPrevious && (
          <button
            onClick={onPrevious}
            className="modal-nav-button modal-prev-button"
          >
            &lt;
          </button>
        )}
        {!!onNext && (
          <button
            onClick={onNext}
            className="modal-nav-button modal-next-button"
          >
            &gt;
          </button>
        )}
      </>
    );
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isOpen && <Modal.Backdrop onClick={handleBackdropClick} />}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {modalOptions.useHeader && (
          <Modal.Header
            onClose={closeModal}
            showCloseButton={modalOptions.showCloseButton}
            className={modalStyle?.headerStyle ? "custom-header" : ""}
            style={modalStyle?.headerStyle}
          >
            {modalHeader || <div>Modal Title</div>}
          </Modal.Header>
        )}
        <Modal.Content style={modalStyle?.contentStyle}>
          {Array.isArray(modalContent) && modalContent[curIdx]}
          {!Array.isArray(modalContent) && modalContent}
        </Modal.Content>
        {modalOptions.useFooter && (
          <Modal.Footer style={modalStyle?.footerStyle}>
            {modalFooter}
            {renderNavigationButtons()}
            <button onClick={closeModal} className="modal-close-btn">
              닫기
            </button>
          </Modal.Footer>
        )}
      </Modal>
    </ModalContext.Provider>
  );
};
