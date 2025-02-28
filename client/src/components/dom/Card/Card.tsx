import { ReactNode } from "react";

interface IAreaProps {
  children: ReactNode;
  width?: number;
  height?: number;
}

const Area: React.FC<IAreaProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Area;
