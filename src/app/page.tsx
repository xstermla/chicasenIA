import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <BrandHeader />
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand">
          Chicas en IA
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight">
          Chicas en IA — Mi idea de app con IA
        </h1>
        <p className="mt-4 text-base text-foreground/80">
          Acá tu equipo puede cargar su idea de app con IA: el problema que
          eligieron, para quién la pensaron, qué haría la inteligencia
          artificial y cómo se ve su primera pantalla.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/registro"
            className="w-full rounded-xl bg-brand px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-[0.99]"
          >
            Registrar mi equipo
          </Link>
          <Link
            href="/login"
            className="w-full rounded-xl border border-brand/30 bg-brand-light px-6 py-4 text-base font-semibold text-brand-dark transition hover:border-brand/50"
          >
            Soy docente / evaluadora
          </Link>
        </div>
      </div>
    </main>
  );
}
