import Dropdown, { DropdownItem } from "@/components/common/Dropdown/Dropdown";
import { useModalContext } from "@/contexts/ModalContext";
import { useEffect } from "react";

const items: DropdownItem[] = [
  {
    id: "input",
    label: "Input",
  },
  {
    id: "button",
    label: "Button",
  },
  {
    id: "dropdown",
    label: "Dropdown",
  },
];

const AddComponent = () => {
  const { modalState, setModalState } = useModalContext();
  useEffect(() => {
    setModalState((prev) => {
      return {
        ...prev,
        type: "input",
      };
    });
  }, []);
  return (
    <div>
      <div>
        <label>Component Type</label>
        <Dropdown
          items={items}
          onClick={(e) => {
            const { id } = e;
            setModalState((prev) => {
              return {
                ...prev,
                type: id,
              };
            });
          }}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          value={modalState?.description || ""}
          onChange={(e) =>
            setModalState((prev) => {
              return {
                ...prev,
                description: e.target.value,
              };
            })
          }
        />
      </div>
      <div>
        <label>Style</label>
        <input
          value={modalState?.style || ""}
          onChange={(e) =>
            setModalState((prev) => {
              return {
                ...prev,
                style: e.target.value,
              };
            })
          }
        />
      </div>
    </div>
  );
};

export default AddComponent;
