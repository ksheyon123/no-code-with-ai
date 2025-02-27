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

  const recursiveRenderer = (item: Item) => {
    return (
      <>
        {!!item.items && (
          <Drawer>
            <List
              {...item}
              itemRenderer={(props) => (
                <>
                  {props.items && (
                    <Drawer>
                      <List {...props} />
                    </Drawer>
                  )}
                </>
              )}
            />
          </Drawer>
        )}
      </>
    );
  };

  return (
    <div className="main">
      <List items={items} itemRenderer={recursiveRenderer} />
    </div>
  );
};

export default Main;
