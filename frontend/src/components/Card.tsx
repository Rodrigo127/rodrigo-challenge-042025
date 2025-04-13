import { AiFillEdit } from "react-icons/ai";
import { useState } from "react";
import CardForm from "./CardForm";
import { useColumnsContext } from "../hooks/use-columns-context";
import { Card as CardType } from "../types";

export default function Card({
  card,
  columnId,
}: {
  card: CardType;
  columnId: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { handleEditCard } = useColumnsContext();

  const showForm = () => {
    setIsEditing(true);
  };

  const handleEdit = (title: string, description: string, columnId: number) => {
    handleEditCard(title, description, columnId, card.id);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold truncate">{card.title}</h3>
        <button className="text-gray-500" onClick={showForm}>
          <AiFillEdit />
        </button>
      </div>
      <p className="text-sm text-gray-500 w-full break-words">
        {card.description}
      </p>
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
    </div>
  );
}
