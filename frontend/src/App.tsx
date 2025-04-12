import { useState } from "react";
import { Column as ColumnType } from "./types";
import Column from "./components/Column";
import Card from "./components/Card";
import Header from "./components/Header";
import { CgAdd } from "react-icons/cg";

// TODO: Remove this
const initialColumns: ColumnType[] = [
  {
    id: 1,
    title: "Column 1",
    cards: [
      { id: 1, title: "Card 1", description: "Card 1 description" },
      { id: 2, title: "Card 2", description: "Card 2 description" },
      { id: 3, title: "Card 3", description: "Card 3 description" },
    ],
  },
  {
    id: 2,
    title: "Column 2",
    cards: [
      ...Array.from({ length: 14 }, (_, i) => ({
        id: i + 4,
        title: `Card ${i + 4}`,
        description: `Card ${i + 4} description`,
      })),
    ],
  },
  {
    id: 3,
    title: "Column 3",
    cards: [],
  },
];

function App() {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

  const handleAddColumn = () => {
    setColumns([
      ...columns,
      {
        id: columns.length + 1,
        title: `Column ${columns.length + 1}`,
        cards: [],
      },
    ]);
  };

  return (
    <div className="flex flex-col bg-rose-50 p-3 h-screen">
      <Header title="Kanban Board" />
      <main className="flex-1 flex gap-2 overflow-y-auto">
        {columns.map((column) => (
          <Column key={column.id} title={column.title}>
            {column.cards.map((card) => (
              <Card
                key={card.id}
                title={card.title}
                description={card.description}
              />
            ))}
          </Column>
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
