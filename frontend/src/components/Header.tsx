import { FaGear } from "react-icons/fa6";
import ColumsConfiguration from "./ColumsConfiguration";
import { useState } from "react";
export default function Header({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <header className="w-full flex items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button className="text-gray-500 text-sm ml-2" onClick={handleOpen}>
        <FaGear />
      </button>
      {isOpen && <ColumsConfiguration onClose={() => setIsOpen(false)} />}
    </header>
  );
}
