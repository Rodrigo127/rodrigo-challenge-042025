import { useState } from "react";
import { useColumnsContext } from "../hooks/use-columns-context";

export default function Column({
  children,
  title,
  id,
}: {
  children?: React.ReactNode;
  title: string;
  id: number;
}) {
  const { handleEditColumn } = useColumnsContext();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const onEditColumn = () => {
    setIsEditing(true);
  };

  const editColumn = () => {
    handleEditColumn(id, newTitle);
    setIsEditing(false);
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
          setNewTitle(title);
        }
      }}
    />
  ) : (
    <div className="flex">
      <h2 className="text-2xl font-bold pb-2 px-3 pt-3">{title}</h2>
      <div className="flex-1 flex pb-2">
        <button
          className="text-xs text-gray-500 h-full flex flex-col justify-end"
          onClick={onEditColumn}
        >
          Edit
        </button>
        <div className="flex-1 flex justify-end items-center"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-w-96 bg-rose-300 rounded-xl gap-1 h-full">
      {titleElement}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto p-3">
        {children}
      </div>
    </div>
  );
}
