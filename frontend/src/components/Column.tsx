import { useState } from "react";
import { useColumnsContext } from "../hooks/use-columns-context";
import CardForm from "./CardForm";
import { Column as ColumnType } from "../types";
import Card from "./Card";

export default function Column({ column }: { column: ColumnType }) {
  const { handleEditColumn, handleAddCard } = useColumnsContext();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const onEditColumn = () => {
    setIsEditing(true);
  };

  const editColumn = () => {
    handleEditColumn(column.id, newTitle);
    setIsEditing(false);
  };

  const onAddCard = () => {
    setIsAddingCard(true);
  };

  const titleElement = isEditing ? (
    <input
      type="text"
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}
      onBlur={editColumn}
      className="text-2xl font-bold pb-2 px-3 pt-3 outline-none border-2 border-rose-400 rounded-t-xl bg-rose-200"
      autoFocus
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          editColumn();
        }

        if (e.key === "Escape") {
          setIsEditing(false);
          setNewTitle(column.title);
        }
      }}
    />
  ) : (
    <div className="flex">
      <h2 className="text-2xl font-bold pb-2 px-3 pt-3 truncate">
        {column.title}
      </h2>
      <div className="flex-1 flex pb-2">
        <button
          className="text-xs text-gray-500 h-full flex flex-col justify-end pr-2"
          onClick={onEditColumn}
        >
          Edit
        </button>
        <div className="flex-1 flex justify-end items-center"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-96 bg-rose-300 rounded-xl gap-1 h-full">
      {titleElement}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto p-3 scrollbar-hidden">
        {column.cards.map((card) => (
          <Card key={card.id} card={card} columnId={column.id} />
        ))}
        <button className="text-xs text-gray-500" onClick={onAddCard}>
          Add Card
        </button>
      </div>
      {isAddingCard && (
        <CardForm
          onClose={() => setIsAddingCard(false)}
          onSubmit={handleAddCard}
          columnId={column.id}
        />
      )}
    </div>
  );
}
