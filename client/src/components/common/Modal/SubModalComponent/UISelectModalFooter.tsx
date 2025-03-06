import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";

const UISelectModalFooter = () => {
  const {} = useBlueprintContext();
  const { modalState } = useModalContext();

  const onClick = () => {};

  return <div>확인</div>;
};
