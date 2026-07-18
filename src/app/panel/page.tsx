import Link from "next/link";
import { getPerfilActual, getEquiposConProyectos } from "./data";
import { escalaLabel } from "@/lib/rubrica";

export default async function PanelPage() {
  const { userId, profile } = await getPerfilActual();
  const equipos = await getEquiposConProyectos(userId);

  return (
    <main className="flex flex-1 flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Equipos</h1>
          {(profile.role === "docente" || profile.role === "admin") && (
            <a
              href="/panel/exportar"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Exportar a CSV
            </a>
          )}
        </div>

        {equipos.length === 0 ? (
          <p className="mt-8 text-foreground/70">
            Todavía no hay equipos registrados en tu institución.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {equipos.map(({ team, cohort, project, miEvaluacion }) => (
              <li key={team.id}>
                <Link
                  href={project ? `/panel/proyecto/${project.id}` : "#"}
                  className="flex items-center justify-between gap-3 rounded-xl border border-black/10 px-4 py-4 transition hover:border-brand/40 hover:bg-brand-light/40"
                >
                  <div>
                    <p className="font-semibold">{team.team_name}</p>
                    <p className="text-sm text-foreground/60">{cohort?.name ?? "—"}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        project?.status === "enviado"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {project?.status === "enviado" ? "Enviado" : "Borrador"}
                    </span>
                    {miEvaluacion && (
                      <span className="text-xs font-medium text-foreground/60">
                        {miEvaluacion.total_score}/12 · {escalaLabel(miEvaluacion.total_score)}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
