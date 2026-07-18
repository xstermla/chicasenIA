import Link from "next/link";

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
      {PASOS.map((p) => {
        const activo = p.slug === actual;
        return (
          <Link
            key={p.slug}
            href={`/proyecto/${code}/${p.slug}`}
            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-semibold transition ${
              activo
                ? "bg-brand text-white"
                : "bg-brand-light text-brand-dark hover:bg-brand/20"
            }`}
          >
            {p.label}
          </Link>
        );
      })}
    </nav>
  );
}
