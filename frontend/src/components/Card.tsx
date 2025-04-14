import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import CardForm from "./CardForm";
import { useColumnsContext } from "../hooks/use-columns-context";
import { Card as CardType } from "../types";
import { useDraggable } from "@dnd-kit/core";
import ConfirmForm from "./ConfirmForm";
export default function Card({
  card,
  columnId,
}: {
  card: CardType;
  columnId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { handleEditCard, handleDeleteCard } = useColumnsContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const showForm = () => {
    setIsEditing(true);
  };

  const showDeleteForm = () => {
    setIsDeleting(true);
  };

  const handleDelete = () => {
    handleDeleteCard(card.id, columnId);
    setIsDeleting(false);
  };

  const handleEdit = (title: string, description: string, columnId: string) => {
    handleEditCard(title, description, columnId, card.id);
    setIsEditing(false);
  };

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id.toString(),
    data: {
      type: "card",
      card,
      columnId,
    },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      className="bg-white rounded-xl p-5 shadow-md"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex justify-between items-center bg-gray-100 rounded-md px-1">
        <div {...attributes} {...listeners} className="flex-1 cursor-grab ">
          <h3 className="text-lg font-bold truncate">{card.title}</h3>
        </div>
        <button className="text-gray-500" onClick={showForm}>
          <AiFillEdit />
        </button>
        <button
          className="text-gray-500 hover:text-red-500 transition-colors pl-2"
          onClick={showDeleteForm}
        >
          <AiFillDelete />
        </button>
      </div>
      <div {...attributes} {...listeners}>
        <p className="text-sm text-gray-500 w-full break-words">
          {card.description}
        </p>
      </div>
      {isEditing && (
        <CardForm
          onClose={() => setIsEditing(false)}
          onSubmit={handleEdit}
          columnId={columnId}
          title={card.title}
          description={card.description}
          id={card.id}
        />
      )}
      {isDeleting && (
        <ConfirmForm
          onClose={() => setIsDeleting(false)}
          onConfirm={handleDelete}
          title={card.title}
        />
      )}
    </div>
  );
}
