import React, { createContext, useContext, ReactNode } from "react";
import Modal from "@/components/common/Modal/Modal";
import { useModal } from "@/hooks/useModal";

interface ModalContextType {
  isOpen: boolean;
  modalContent: ReactNode | null;
  modalState: Record<string, any>;
  setModalState: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  openModal: (content: ReactNode) => void;
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
    modalState,
    setModalState,
    openModal,
    closeModal,
  } = useModal();

  const value = {
    isOpen,
    modalContent,
    modalState,
    setModalState,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isOpen && <Modal.Backdrop onClick={closeModal} />}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <Modal.Header onClose={closeModal} showCloseButton={true}>
          <div>Modal Title</div>
        </Modal.Header>
        <Modal.Content>{modalContent}</Modal.Content>
        <Modal.Footer>
          <button onClick={closeModal}>닫기</button>
        </Modal.Footer>
      </Modal>
    </ModalContext.Provider>
  );
};
