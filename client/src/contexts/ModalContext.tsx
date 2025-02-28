import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isOpen: boolean;
  modalContent: ReactNode | null;
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
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // 애니메이션을 위해 약간의 지연 후 content 제거
    setTimeout(() => {
      setModalContent(null);
    }, 300);
  };

  const value = {
    isOpen,
    modalContent,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
