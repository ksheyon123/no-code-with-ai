import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";
import { createRandomHash } from "@/utils/crypto";
import { generateArchitectureCode } from "@/workers/architectureWorkerManager";

const UISelectModalFooter = () => {
  const { updateBlueprint } = useBlueprintContext();
  const { modalState } = useModalContext();

  const add = () => {
    const d = modalState;
    const tagId = createRandomHash();
    generateArchitectureCode(
      {
        id: tagId,
        type: "input",
        ...d,
      },
      {
        onSuccess: (payload) => {
          updateBlueprint(tagId, d.targetId, {
            ...payload,
          });
        },
      }
    );
  };

  const insert = () => {
    const d = modalState;
    const tagId = createRandomHash();
    updateBlueprint(tagId, d.parentId, {
      ...d,
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
