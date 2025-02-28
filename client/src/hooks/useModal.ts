import { ReactNode, useState } from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalState, setModalState] = useState({});

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
  return {
    isOpen,
    modalContent,
    modalState,
    setModalState,
    openModal,
    closeModal,
  };
};

export { useModal };
