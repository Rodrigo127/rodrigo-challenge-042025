import Modal from "./Modal";

export default function ConfirmForm({
  onClose,
  onConfirm,
  title,
}: {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}) {
  return (
    <Modal onClose={onClose}>
      <form onSubmit={onConfirm}>
        <span className="text-lg font-bold">
          Are you sure you want to delete "{title}"?
        </span>
        <div className="flex gap-2 justify-center mt-8">
          <button
            type="button"
            onClick={onClose}
            className="bg-amber-300 px-4 py-2 rounded-md text-amber-900 font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-red-500 px-4 py-2 rounded-md text-amber-900 font-bold"
          >
            Confirm
          </button>
        </div>
      </form>
    </Modal>
  );
}
