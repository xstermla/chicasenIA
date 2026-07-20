import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";

export default function LandingPage() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-brand-orange/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 -right-20 h-72 w-72 rounded-full bg-brand-green/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-brand-red/15 blur-3xl"
      />

      <div className="relative w-full max-w-md text-center">
        <BrandHeader />
        <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-balance">
          Mi Proyecto/App
        </h1>
        <p className="mt-4 text-base text-foreground/80">
          Aquí tu equipo puede cargar su idea de app con IA: el problema que
          eligieron, para quién la pensaron, qué haría la inteligencia
          artificial y cómo se ve su primera pantalla.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/registro"
            style={{ backgroundImage: "var(--brand-gradient)" }}
            className="w-full rounded-2xl px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition active:scale-[0.98]"
          >
            Registrar mi equipo 🚀
          </Link>
          <Link
            href="/login"
            className="w-full rounded-2xl border-2 border-brand/25 bg-brand-light px-6 py-4 text-base font-semibold text-brand-dark transition hover:border-brand/50"
          >
            Docentes/responsables
          </Link>
          <Link
            href="/ayuda"
            className="w-full rounded-2xl px-6 py-3 text-sm font-semibold text-brand-dark underline decoration-brand-orange decoration-2 underline-offset-4"
          >
            Sobre el programa
          </Link>
        </div>
      </div>
    </main>
  );
}
