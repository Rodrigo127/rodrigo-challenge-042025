export default function Column({
  children,
  title,
}: {
  children?: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col min-w-96 bg-rose-300 rounded-xl gap-1 h-full">
      <h2 className="text-2xl font-bold pb-2 px-3 pt-3">{title}</h2>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto p-3">
        {children}
      </div>
    </div>
  );
}
