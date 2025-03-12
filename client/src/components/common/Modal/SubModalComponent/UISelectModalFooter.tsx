import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";
import { ElementGenerationParams } from "@/types";
import { createRandomHash } from "@/utils/crypto";
import { generateArchitectureCode } from "@/workers/architectureWorkerManager";

const UISelectModalFooter = () => {
  const { updateBlueprint } = useBlueprintContext();
  const { modalState } = useModalContext<ElementGenerationParams>();

  const add = () => {
    const tagId = createRandomHash();
    generateArchitectureCode(
      {
        targetId: tagId,
        ...modalState,
      },
      {
        onSuccess: ({ message }: any) => {
          console.log(message);
        },
      }
    );
  };

  const insert = () => {
    const tagId = createRandomHash();
    updateBlueprint(tagId, modalState.parentElId, {
      ...modalState,
    });
  };

  return (
    <>
      <div onClick={add}>추가</div>
      <div onClick={insert}>삽입</div>
    </>
  );
};

export default UISelectModalFooter;
