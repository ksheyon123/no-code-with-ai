import { DropdownItem } from "@/components/common/Dropdown/Dropdown";
import { Item } from "@/components/common/List/List";

const sampleListData: Item[] = [
  {
    id: "1",
    label: "1",
    items: [
      {
        id: "1-1",
        label: "1-1",
      },
      {
        id: "1-2",
        label: "1-2",
      },
    ],
  },
  {
    id: "2",
    label: "2",
  },
  {
    id: "3",
    label: "3",
  },
];

const sampleDropdownData: DropdownItem[] = [
  {
    id: "1",
    label: "옵션 1",
  },
  {
    id: "2",
    label: "옵션 2",
  },
  {
    id: "3",
    label: "옵션 3",
  },
];
export { sampleListData, sampleDropdownData };
