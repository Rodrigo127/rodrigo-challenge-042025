import Column from "./components/Column";
import Header from "./components/Header";
import { CgAdd } from "react-icons/cg";
import { useColumnsContext } from "./hooks/use-columns-context";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

function App() {
  const { columns, handleAddColumn, handleMoveCard } = useColumnsContext();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    handleMoveCard(
      active.data.current.card,
      active.data.current.columnId,
      parseInt(over.id)
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
