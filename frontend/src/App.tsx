import Column from "./components/Column";
import Header from "./components/Header";
import { CgAdd } from "react-icons/cg";
import { useColumnsContext } from "./hooks/use-columns-context";

function App() {
  const { columns, handleAddColumn } = useColumnsContext();

  return (
    <div className="flex flex-col bg-rose-50 p-3 h-screen">
      <Header title="Kanban Board" />
      <main className="flex-1 flex gap-2 overflow-y-auto">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
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
