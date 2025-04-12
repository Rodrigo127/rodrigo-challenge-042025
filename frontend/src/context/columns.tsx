import { createContext, useState } from "react";
import { Column as ColumnType } from "../types";

interface ColumnsContextType {
  columns: ColumnType[];
  handleAddColumn: () => void;
  handleEditColumn: (id: number, title: string) => void;
}

// TODO: Remove this
const initialColumns: ColumnType[] = [
  {
    id: 1,
    title: "Column 1",
    cards: [
      { id: 1, title: "Card 1", description: "Card 1 description" },
      { id: 2, title: "Card 2", description: "Card 2 description" },
      { id: 3, title: "Card 3", description: "Card 3 description" },
    ],
  },
  {
    id: 2,
    title: "Column 2",
    cards: [
      ...Array.from({ length: 14 }, (_, i) => ({
        id: i + 4,
        title: `Card ${i + 4}`,
        description: `Card ${i + 4} description`,
      })),
    ],
  },
  {
    id: 3,
    title: "Column 3",
    cards: [],
  },
];

export const ColumnsContext = createContext<ColumnsContextType>({
  columns: initialColumns,
  handleAddColumn: () => {},
  handleEditColumn: () => {},
});

export const ColumnsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

  const handleAddColumn = () => {
    setColumns([
      ...columns,
      {
        id: columns.length + 1,
        title: `Column ${columns.length + 1}`,
        cards: [],
      },
    ]);
  };

  const handleEditColumn = (id: number, title: string) => {
    setColumns(
      columns.map((column) =>
        column.id === id ? { ...column, title } : column
      )
    );
  };

  const valueToShare = {
    columns,
    handleAddColumn,
    handleEditColumn,
  };

  return (
    <ColumnsContext.Provider value={valueToShare}>
      {children}
    </ColumnsContext.Provider>
  );
};
