import { useContext } from "react";
import { ColumnsContext } from "../context/columns";

export const useColumnsContext = () => {
  return useContext(ColumnsContext);
};
