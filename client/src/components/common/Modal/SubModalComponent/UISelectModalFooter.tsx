import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";
import { createRandomHash } from "@/utils/crypto";
import { generateArchitectureCode } from "@/workers/architectureWorkerManager";

const UISelectModalFooter = () => {
  const { updateBlueprint } = useBlueprintContext();
  const { modalState } = useModalContext();

  const add = () => {
    const d = modalState;
    console.log("Modal Data : ", d);
    const tagId = createRandomHash();
    generateArchitectureCode(
      {
        ...d,
        id: tagId,
        type: d.type,
      },
      {
        onSuccess: ({ message }: any) => {
          const { component_name, imports, jsx_code } = message;
          updateBlueprint(tagId, d.targetId, {
            ...d,
            jsx: jsx_code,
            componentName: component_name,
            imports,
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
