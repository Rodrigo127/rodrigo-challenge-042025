import Column from "./components/Column";
import Header from "./components/Header";
import { useColumnsContext } from "./hooks/use-columns-context";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Card } from "./types";

function App() {
  const { columns, handleMoveCard } = useColumnsContext();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    handleMoveCard(
      active.data.current?.card as Card,
      active.data.current?.columnId as number,
      parseInt(over.id as string)
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
      </main>
    </div>
  );
}

export default App;
