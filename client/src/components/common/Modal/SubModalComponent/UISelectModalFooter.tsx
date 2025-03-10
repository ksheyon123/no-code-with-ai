import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";
import { createRandomHash } from "@/utils/crypto";

const UISelectModalFooter = () => {
  const { updateBlueprint } = useBlueprintContext();
  const { modalState } = useModalContext();

  const add = () => {
    const d = modalState;
    const tagId = createRandomHash();
    updateBlueprint(tagId, d.targetId, {
      ...d,
    });
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
