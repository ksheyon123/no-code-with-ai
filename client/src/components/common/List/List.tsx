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
    <ul>
      {items.map((item, idx) => {
        const { id, label } = item;
        return (
          <li key={id + idx}>
            <span>{label}</span>
            {!!itemRenderer && itemRenderer(item)}
          </li>
        );
      })}
    </ul>
  );
};

export default List;
