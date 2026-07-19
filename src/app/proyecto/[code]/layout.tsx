import Image from "next/image";

export default function ProyectoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex flex-col items-center gap-1 border-b border-black/10 bg-background/95 px-4 py-3 text-center backdrop-blur">
        <div className="flex items-center gap-3">
          <Image src="/brand/chicas-en-ia-logo.png" alt="Chicas en IA" width={130} height={32} />
          <Image src="/brand/xstem-logo.svg" alt="XSTEM" width={84} height={27} unoptimized />
        </div>
        <p className="text-sm font-semibold text-brand-dark">
          Completa esto con tu grupo — no hay respuestas incorrectas.
        </p>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
