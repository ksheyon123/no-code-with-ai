import { CSSProperties, ReactNode, useState } from "react";

interface ModalOptions {
  props: any;
  style?: ModalStyle;
}

type ModalStyle = {
  headerStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  footerStyle?: CSSProperties;
};

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalOptions, setModalOptions] = useState<{ [key: string]: any }>({});
  const [modalState, setModalState] = useState({});
  const [modalStyle, setModalStyle] = useState<ModalStyle>({});

  const openModal = (
    content: ReactNode,
    header?: ReactNode,
    footer?: ReactNode,
    options?: ModalOptions
  ) => {
    setModalContent(content);
    if (options?.style) {
      setModalStyle(options?.style);
    }
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
    modalStyle,
    openModal,
    closeModal,
  };
};

export { useModal };
