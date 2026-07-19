import Link from "next/link";
import { getPerfilActual, getEquiposConProyectos } from "./data";
import { escalaLabel } from "@/lib/rubrica";

export default async function PanelPage() {
  const { userId, profile } = await getPerfilActual();
  const equipos = await getEquiposConProyectos(userId);

  return (
    <main className="flex flex-1 flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Equipos</h1>
          {(profile.role === "docente" || profile.role === "admin") && (
            <a
              href="/panel/exportar"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Exportar a Excel
            </a>
          )}
        </div>

        {equipos.length === 0 ? (
          <p className="mt-8 text-foreground/70">
            Todavía no hay equipos registrados en tu institución.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl border border-black/10">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-brand-light/40 text-left">
                  <th className="px-4 py-3 font-semibold">Equipo</th>
                  <th className="px-4 py-3 font-semibold">Cohorte</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-3 py-3 text-center font-semibold">Eje 1</th>
                  <th className="px-3 py-3 text-center font-semibold">Eje 2</th>
                  <th className="px-3 py-3 text-center font-semibold">Eje 3</th>
                  <th className="px-3 py-3 text-center font-semibold">Eje 4</th>
                  <th className="px-3 py-3 text-center font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Escala</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map(({ team, cohort, project, miEvaluacion }) => (
                  <tr key={team.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={project ? `/panel/proyecto/${project.id}` : "#"}
                        className="hover:text-brand-dark hover:underline"
                      >
                        {team.team_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground/60">{cohort?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          project?.status === "enviado"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {project?.status === "enviado" ? "Enviado" : "Borrador"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">{miEvaluacion?.score_eje1 ?? "—"}</td>
                    <td className="px-3 py-3 text-center">{miEvaluacion?.score_eje2 ?? "—"}</td>
                    <td className="px-3 py-3 text-center">{miEvaluacion?.score_eje3 ?? "—"}</td>
                    <td className="px-3 py-3 text-center">{miEvaluacion?.score_eje4 ?? "—"}</td>
                    <td className="px-3 py-3 text-center font-semibold text-brand-dark">
                      {miEvaluacion ? `${miEvaluacion.total_score}/12` : "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground/60">
                      {miEvaluacion ? escalaLabel(miEvaluacion.total_score) : "Sin evaluar"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
