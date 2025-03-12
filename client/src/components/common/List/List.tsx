import React, { ReactNode } from "react";

export type Item = {
  id: string;
  label: string;
  items?: Item[];
};

export type ItemRenderer = (item: Item) => ReactNode;

interface IListProps {
  items?: Item[];
  itemRenderer?: ItemRenderer;
}

const List: React.FC<IListProps> = ({ items = [], itemRenderer }) => {
  return (
    <div>
      {items.map((item, idx) => {
        const { id, label } = item;
        return (
          <div key={id + idx}>
            {!itemRenderer && <span>{label}</span>}
            {!!itemRenderer && itemRenderer(item)}
          </div>
        );
      })}
    </div>
  );
};

export default List;
