export default function ProyectoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-black/10 bg-background/95 px-4 py-3 text-center backdrop-blur">
        <p className="text-sm font-semibold text-brand-dark">
          Completá esto con tu grupo — no hay respuestas incorrectas.
        </p>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
