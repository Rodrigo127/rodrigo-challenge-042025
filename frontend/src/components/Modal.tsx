import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const modalContainer = document.querySelector(".modal-container");

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!modalContainer) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-amber-200 rounded-xl p-5 flex flex-col gap-2 inset-40"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    modalContainer
  );
}
