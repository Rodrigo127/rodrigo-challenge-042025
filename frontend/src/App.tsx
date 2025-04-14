import Column from "./components/Column";
import Header from "./components/Header";
import { useColumnsContext } from "./hooks/use-columns-context";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Card } from "./types";
import { CgAdd } from "react-icons/cg";

function App() {
  const { columns, handleMoveCard, handleAddColumn } = useColumnsContext();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    handleMoveCard(
      active.data.current?.card as Card,
      active.data.current?.columnId as number,
      over.id as string
    );
  };

  return (
    <div className="flex flex-col bg-rose-50 p-3 h-screen">
      <Header title="Kanban Board" />
      <main className="flex-1 flex gap-2 overflow-y-auto">
        <DndContext onDragEnd={handleDragEnd}>
          {columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </DndContext>
        <div className="rounded-xl flex items-center justify-center">
          <button
            className="bg-rose-400 text-white px-2 py-2 rounded-xl"
            onClick={handleAddColumn}
          >
            <CgAdd size={24} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
