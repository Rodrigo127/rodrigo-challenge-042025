import { createContext, useState } from "react";
import { Column as ColumnType, Card as CardType } from "../types";

interface ColumnsContextType {
  columns: ColumnType[];
  handleAddColumn: () => void;
  handleEditColumn: (id: number, title: string) => void;
  handleAddCard: (title: string, description: string, columnId: number) => void;
  handleEditCard: (
    title: string,
    description: string,
    columnId: number,
    id: number
  ) => void;
  handleMoveCard: (
    card: CardType,
    originalColumnId: number,
    targetColumnId: number
  ) => void;
  handleDeleteCard: (cardId: number, columnId: number) => void;
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
  handleAddCard: () => {},
  handleEditCard: () => {},
  handleMoveCard: () => {},
  handleDeleteCard: () => {},
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

  const handleAddCard = (
    title: string,
    description: string,
    columnId: number
  ) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: [
                ...column.cards,
                {
                  id: column.cards.length + 1,
                  title,
                  description,
                },
              ],
            }
          : column
      )
    );
  };

  const handleEditCard = (
    title: string,
    description: string,
    columnId: number,
    id: number
  ) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map((card) =>
                card.id === id ? { ...card, title, description } : card
              ),
            }
          : column
      )
    );
  };

  const handleMoveCard = (
    card: CardType,
    originalColumnId: number,
    targetColumnId: number
  ) => {
    if (originalColumnId === targetColumnId) return;
    setColumns(
      columns.map((column) => {
        if (column.id === originalColumnId) {
          return {
            ...column,
            cards: column.cards.filter((c) => c.id !== card.id),
          };
        }

        if (column.id === targetColumnId) {
          return {
            ...column,
            cards: [...column.cards, card],
          };
        }

        return column;
      })
    );
  };

  const handleDeleteCard = (cardId: number, columnId: number) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.filter((card) => card.id !== cardId),
            }
          : column
      )
    );
  };

  const valueToShare = {
    columns,
    handleAddColumn,
    handleEditColumn,
    handleAddCard,
    handleEditCard,
    handleMoveCard,
    handleDeleteCard,
  };

  return (
    <ColumnsContext.Provider value={valueToShare}>
      {children}
    </ColumnsContext.Provider>
  );
};
