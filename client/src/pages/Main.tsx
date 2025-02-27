import React from "react";
import LNB from "@/components/common/LNB/LNB";
import List, { Item } from "@/components/common/List/List";
import Drawer from "@/components/common/Drawer/Drawer";

const Main: React.FC = () => {
  const items = [
    {
      id: "1",
      label: "상위메뉴1",
      items: [
        {
          id: "1-1",
          label: "하위메뉴1-1",
          items: [
            { id: "1-1-1", label: "하위메뉴1-1-1" },
            { id: "1-1-2", label: "하위메뉴1-1-2" },
          ],
        },
        { id: "1-2", label: "하위메뉴1-2" },
      ],
    },
    {
      id: "2",
      label: "상위메뉴2",
      items: [{ id: "2-1", label: "하위메뉴2-1" }],
    },
  ];

  const renderer = (item: Item) => {
    const { label } = item;
    return (
      <Drawer title={label}>
        <List {...item} itemRenderer={renderer} />
      </Drawer>
    );
  };

  return (
    <div className="main">
      <List items={items} itemRenderer={renderer} />
    </div>
  );
};

export default Main;
