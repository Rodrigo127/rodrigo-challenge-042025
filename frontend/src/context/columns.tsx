import { createContext, useState, useEffect } from "react";
import { Column as ColumnType, Card as CardType } from "../types";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_COLUMNS,
  UPDATE_COLUMN_CARDS,
  CREATE_COLUMN,
  REMOVE_COLUMN,
} from "../graphql/queries";
import { v4 as uuidv4 } from "uuid";

interface ColumnsContextType {
  columns: ColumnType[];
  handleAddColumn: () => void;
  handleEditColumn: (column: ColumnType, newTitle: string) => void;
  handleAddCard: (title: string, description: string, columnId: string) => void;
  handleEditCard: (
    title: string,
    description: string,
    columnId: string,
    id: string
  ) => void;
  handleMoveCard: (
    card: CardType,
    originalColumnId: string,
    targetColumnId: string
  ) => void;
  handleDeleteCard: (cardId: string, columnId: string) => void;
  handleReorderColumns: (columns: ColumnType[]) => void;
  handleRemoveColumn: (columnId: string) => void;
}

// eslint-disable-next-line
export const ColumnsContext = createContext<ColumnsContextType>({
  columns: [],
  handleAddColumn: () => {},
  handleEditColumn: () => {},
  handleAddCard: () => {},
  handleEditCard: () => {},
  handleMoveCard: () => {},
  handleDeleteCard: () => {},
  handleReorderColumns: () => {},
  handleRemoveColumn: () => {},
});

export const ColumnsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data } = useQuery(GET_COLUMNS);
  const [updateColumnCards] = useMutation(UPDATE_COLUMN_CARDS);
  const [createColumn] = useMutation(CREATE_COLUMN);
  const [removeColumn] = useMutation(REMOVE_COLUMN);
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
          colIndex: newColumn.colIndex,
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
        colIndex: column.colIndex,
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
    columnId: string
  ) => {
    const column = columns.find((column) => column.id === columnId);
    if (!column) return;
    const uuid = uuidv4();
    const newCard = {
      id: `${uuid}`,
      title,
      description,
    };

    updateColumnCards({
      variables: {
        id: columnId,
        cards: JSON.stringify([...(column.cards as CardType[]), newCard]),
        colIndex: column.colIndex,
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
    columnId: string,
    id: string
  ) => {
    const column = columns.find((column) => column.id === columnId);
    if (!column) return;

    const updatedCards = (column.cards as CardType[]).map((card) =>
      card.id === id ? { ...card, title, description } : card
    );

    updateColumnCards({
      variables: {
        id: columnId,
        cards: JSON.stringify(updatedCards),
        colIndex: column.colIndex,
        title: column.title,
      },
    }).then(() => {
      setColumns(
        columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                cards: updatedCards,
              }
            : column
        )
      );
    });
  };

  const handleMoveCard = (
    card: CardType,
    originalColumnId: string,
    targetColumnId: string
  ) => {
    if (originalColumnId === targetColumnId) return;
    const originalColumn = columns.find(
      (column) => column.id === originalColumnId
    );
    const targetColumn = columns.find((column) => column.id === targetColumnId);
    if (!originalColumn || !targetColumn) return;
    const updatedCardsOriginalColumn = (
      originalColumn.cards as CardType[]
    ).filter((c) => c.id !== card.id);
    const updatedCardsTargetColumn = [
      ...(targetColumn.cards as CardType[]),
      card,
    ];

    updateColumnCards({
      variables: {
        id: targetColumnId,
        cards: JSON.stringify(updatedCardsTargetColumn),
        colIndex: targetColumn.colIndex,
        title: targetColumn.title,
      },
    }).then(() => {
      updateColumnCards({
        variables: {
          id: originalColumnId,
          cards: JSON.stringify(updatedCardsOriginalColumn),
          colIndex: originalColumn.colIndex,
          title: originalColumn.title,
        },
      }).then(() => {
        setColumns(
          columns.map((column) => {
            if (column.id === originalColumnId) {
              return { ...column, cards: updatedCardsOriginalColumn };
            }
            if (column.id === targetColumnId) {
              return { ...column, cards: updatedCardsTargetColumn };
            }
            return column;
          })
        );
      });
    });
  };

  const handleDeleteCard = (cardId: string, columnId: string) => {
    const column = columns.find((column) => column.id === columnId);
    if (!column) return;
    const updatedCards = (column.cards as CardType[]).filter(
      (card) => card.id !== cardId
    );

    updateColumnCards({
      variables: {
        id: columnId,
        cards: JSON.stringify(updatedCards),
        colIndex: column.colIndex,
        title: column.title,
      },
    }).then(() => {
      setColumns(
        columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                cards: updatedCards,
              }
            : column
        )
      );
    });
  };

  const handleReorderColumns = (newColumns: ColumnType[]) => {
    Promise.all(
      newColumns.map((column) => {
        updateColumnCards({
          variables: {
            id: column.id,
            cards: JSON.stringify(column.cards),
            colIndex: column.colIndex,
            title: column.title,
          },
        });
      })
    ).then(() => {
      setColumns([...newColumns.sort((a, b) => a.colIndex - b.colIndex)]);
    });
  };

  const handleRemoveColumn = (columnId: string) => {
    removeColumn({
      variables: {
        id: columnId,
      },
    }).then(() => {
      setColumns(columns.filter((column) => column.id !== columnId));
    });
  };

  const valueToShare = {
    columns,
    handleAddColumn,
    handleEditColumn,
    handleAddCard,
    handleEditCard,
    handleMoveCard,
    handleDeleteCard,
    handleReorderColumns,
    handleRemoveColumn,
  };

  return (
    <ColumnsContext.Provider value={valueToShare}>
      {children}
    </ColumnsContext.Provider>
  );
};
