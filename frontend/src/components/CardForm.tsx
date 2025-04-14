import { useState } from "react";
import Modal from "./Modal";

interface CardFormProps {
  onClose: () => void;
  title?: string;
  description?: string;
  columnId: string;
  onSubmit: (
    title: string,
    description: string,
    columnId: string,
    id?: string
  ) => void;
  id?: string;
}

export default function CardForm({
  onClose,
  title = "",
  description = "",
  columnId,
  id,
  onSubmit,
}: CardFormProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(newTitle, newDescription, columnId, id);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="rounded-xl p-5 flex flex-col gap-2 w-96"
      >
        <input
          type="text"
          placeholder="Title"
          className="bg-amber-100 outline-none rounded-md p-2"
          autoFocus
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="bg-amber-100 outline-none rounded-md p-2"
          rows={8}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button className="bg-amber-300 rounded-md p-2">Add Card</button>
      </form>
    </Modal>
  );
}
