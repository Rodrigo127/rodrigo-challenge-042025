import { createContext, useState, useEffect } from "react";
import { Column as ColumnType, Card as CardType } from "../types";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COLUMNS, UPDATE_COLUMN_CARDS } from "../graphql/queries";

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

export const ColumnsContext = createContext<ColumnsContextType>({
  columns: [],
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
  const { loading, error, data } = useQuery(GET_COLUMNS);
  const [updateColumnCards] = useMutation(UPDATE_COLUMN_CARDS);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  console.log(data);

  useEffect(() => {
    if (data) {
      setColumns(
        data.columns.map((column: ColumnType) => ({
          ...column,
          cards: JSON.parse(column?.cards as string),
        }))
      );
    }
  }, [data]);

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
    const column = columns.find((column) => column.id === columnId);
    if (!column) return;
    const newCard = {
      id: `${column.id}-${column.cards.length + 1}`,
      title,
      description,
    };

    updateColumnCards({
      variables: {
        id: columnId,
        cards: JSON.stringify([...(column.cards as CardType[]), newCard]),
        order: column.order,
      },
    });

    column.cards = [...(column.cards as CardType[]), newCard];
    setColumns([...columns]);
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
