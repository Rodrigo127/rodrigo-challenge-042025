export default function Header({ title }: { title: string }) {
  return (
    <header className="w-full">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
