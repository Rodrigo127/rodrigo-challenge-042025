import { AiFillEdit } from "react-icons/ai";
import { useState } from "react";
import CardForm from "./CardForm";
import { useColumnsContext } from "../hooks/use-columns-context";

export default function Card({
  title,
  description,
  columnId,
  id,
}: {
  title: string;
  description: string;
  columnId: number;
  id: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { handleEditCard } = useColumnsContext();

  const showForm = () => {
    setIsEditing(true);
  };

  const handleEdit = (title: string, description: string, columnId: number) => {
    handleEditCard(title, description, columnId, id);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold truncate">{title}</h3>
        <button className="text-gray-500" onClick={showForm}>
          <AiFillEdit />
        </button>
      </div>
      <p className="text-sm text-gray-500 w-full break-words">{description}</p>
      {isEditing && (
        <CardForm
          onClose={() => setIsEditing(false)}
          onSubmit={handleEdit}
          columnId={columnId}
          title={title}
          description={description}
          id={id}
        />
      )}
    </div>
  );
}
