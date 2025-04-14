import Modal from "./Modal";
import { useColumnsContext } from "../hooks/use-columns-context";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { Column as ColumnType } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
const SortableItem = ({ column }: { column: ColumnType }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div
      key={column.id}
      className="border-2 border-amber-500 rounded-md p-2 bg-amber-100"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {column.title}
    </div>
  );
};

export default function ColumsConfiguration({
  onClose,
}: {
  onClose: () => void;
}) {
  const { columns, handleReorderColumns } = useColumnsContext();
  const [columnsState, setColumnsState] = useState([...columns]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setColumnsState((prev) => {
        const oldIndex = prev.findIndex((column) => column.id === active.id);
        const newIndex = prev.findIndex((column) => column.id === over.id);

        return arrayMove(prev, oldIndex, newIndex).map((column, index) => ({
          ...column,
          colIndex: index + 1,
        }));
      });
    }
  };

  const handleSave = () => {
    handleReorderColumns(columnsState);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={dragEnd}
      >
        <SortableContext
          items={columnsState}
          strategy={verticalListSortingStrategy}
        >
          <div className="h-96 w-96 overflow-y-auto scrollbar-hidden flex flex-col gap-1">
            {columnsState.map((column) => (
              <SortableItem key={column.id} column={column} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button className="bg-amber-300 rounded-md p-2" onClick={handleSave}>
        Save
      </button>
    </Modal>
  );
}
