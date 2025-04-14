import { createContext, useState, useEffect } from "react";
import { Column as ColumnType, Card as CardType } from "../types";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_COLUMNS,
  UPDATE_COLUMN_CARDS,
  CREATE_COLUMN,
} from "../graphql/queries";

interface ColumnsContextType {
  columns: ColumnType[];
  handleAddColumn: () => void;
  handleEditColumn: (column: ColumnType, newTitle: string) => void;
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
  const [createColumn] = useMutation(CREATE_COLUMN);
  const [columns, setColumns] = useState<ColumnType[]>([]);

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
    createColumn({
      variables: {
        title: `Column ${columns.length + 1}`,
      },
    }).then((result) => {
      const newColumn = result.data.createColumn.column;
      setColumns([
        ...columns,
        {
          id: newColumn.id,
          title: newColumn.title,
          cards: JSON.parse(newColumn.cards as string),
          order: newColumn.order,
        },
      ]);
    });
  };

  const handleEditColumn = (column: ColumnType, newTitle: string) => {
    updateColumnCards({
      variables: {
        id: column.id,
        title: newTitle,
        cards: JSON.stringify(column.cards),
        order: column.order,
      },
    }).then((result) => {
      const updatedColumn = result.data.updateColumnCards.column;
      setColumns(
        columns.map((column) =>
          column.id === updatedColumn.id
            ? { ...column, title: updatedColumn.title }
            : column
        )
      );
    });
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
        title: column.title,
      },
    }).then(() => {
      column.cards = [...(column.cards as CardType[]), newCard] as CardType[];
      setColumns([...columns]);
    });
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
