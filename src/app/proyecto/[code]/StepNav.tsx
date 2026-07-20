import Link from "next/link";

const COLORES = ["var(--brand)", "var(--brand-orange)", "var(--brand-green)", "var(--brand-red)"];

const PASOS = [
  { slug: "paso-1", label: "1" },
  { slug: "paso-2", label: "2" },
  { slug: "paso-3", label: "3" },
  { slug: "paso-4", label: "4" },
  { slug: "paso-5", label: "5" },
  { slug: "pitch", label: "Pitch" },
];

export default function StepNav({ code, actual }: { code: string; actual: string }) {
  return (
    <nav className="flex items-center justify-center gap-2 py-4">
      {PASOS.map((p, i) => {
        const activo = p.slug === actual;
        const color = COLORES[i % COLORES.length];
        return (
          <Link
            key={p.slug}
            href={`/proyecto/${code}/${p.slug}`}
            style={
              activo
                ? { backgroundColor: color, color: "white" }
                : { color, borderColor: color }
            }
            className={`flex h-9 min-w-9 items-center justify-center rounded-full border-2 px-2 text-sm font-bold transition ${
              activo ? "" : "bg-transparent hover:opacity-70"
            }`}
          >
            {p.label}
          </Link>
        );
      })}
    </nav>
  );
}
