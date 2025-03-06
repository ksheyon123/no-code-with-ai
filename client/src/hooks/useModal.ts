import { CSSProperties, ReactNode, useState } from "react";

interface ModalOptions {
  useHeader?: boolean;
  useFooter?: boolean;
  showCloseButton?: boolean;
  showNavigationButtons?: boolean;
  style?: ModalStyle;
  onPrevious?: () => void;
  onNext?: () => void;
}

type ModalStyle = {
  headerStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  footerStyle?: CSSProperties;
};

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<
    ReactNode | ReactNode[] | null
  >(null);
  const [modalHeader, setModalHeader] = useState<ReactNode | null>(null);
  const [modalFooter, setModalFooter] = useState<ReactNode | null>(null);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    useHeader: true,
    useFooter: true,
    showCloseButton: true,
    showNavigationButtons: false,
  });
  const [modalState, setModalState] = useState<Record<string, any>>({});
  const [modalStyle, setModalStyle] = useState<ModalStyle>({});

  const [curIdx, setCurIdx] = useState<number>(0);

  const openModal = (
    content: ReactNode | ReactNode[],
    header?: ReactNode,
    footer?: ReactNode,
    options?: ModalOptions
  ) => {
    setModalContent(content);
    setModalHeader(header);
    setModalFooter(footer);

    if (options) {
      setModalOptions({
        ...modalOptions,
        ...options,
      });
    }

    if (options?.style) {
      setModalStyle(options.style);
    }

    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // 애니메이션을 위해 약간의 지연 후 content 제거
    setTimeout(() => {
      setModalContent(null);
      setModalHeader(null);
      setModalFooter(null);
      setModalState({});
    }, 300);
  };

  const onPrevious = () => {
    if (Array.isArray(modalContent)) {
      const contentLen = modalContent.length;
      setCurIdx((prev) => (prev - 1 + contentLen) % contentLen);
    }
  };

  const onNext = () => {
    if (Array.isArray(modalContent)) {
      const contentLen = modalContent.length;
      setCurIdx((prev) => (prev + 1) % contentLen);
    }
  };

  return {
    isOpen,
    modalContent,
    modalHeader,
    modalFooter,
    modalOptions,
    modalState,
    setModalState,
    curIdx,
    modalStyle,
    openModal,
    closeModal,
    onPrevious,
    onNext,
  };
};

export { useModal };
