import { notFound } from "next/navigation";
import { getProyectoDetalle, getBocetoSignedUrlPanel } from "../../data";
import RubricaForm from "./RubricaForm";
import ReabrirButton from "./ReabrirButton";

function Campo({ label, valor }: { label: string; valor: string | null | undefined }) {
  if (!valor) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-base">{valor}</p>
    </div>
  );
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const detalle = await getProyectoDetalle(projectId);
  if (!detalle) notFound();

  const { team, cohort, project, miEvaluacion } = detalle;
  const bocetoUrl = await getBocetoSignedUrlPanel(project.boceto_url);

  return (
    <main className="flex flex-1 flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{team.team_name}</h1>
            <p className="text-sm text-foreground/60">
              {cohort?.name} · {team.members?.join(", ")}
            </p>
          </div>
          {project.status === "enviado" && <ReabrirButton projectId={project.id} />}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-black/10 p-4">
          <Campo label="Problema" valor={project.problema} />
          <Campo label="Para quién" valor={project.para_quien} />
          <Campo
            label="Qué haría la IA"
            valor={[...(project.ia_funciones ?? []), project.ia_otra].filter(Boolean).join(" · ")}
          />
          {bocetoUrl && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                Boceto
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bocetoUrl}
                alt="Boceto de la pantalla principal"
                className="mt-1 w-full rounded-lg border border-black/10 object-contain"
              />
            </div>
          )}
          <Campo label="Nombre de la app" valor={project.nombre_app} />
          <Campo label="Por qué ese nombre" valor={project.nombre_por_que} />

          <div className="rounded-lg bg-brand-light/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Pitch</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">
              {project.pitch_se_llama && `Nuestra app se llama ${project.pitch_se_llama}. `}
              {project.pitch_la_creamos_para && `La creamos para ${project.pitch_la_creamos_para}. `}
              {project.pitch_problema_resuelve &&
                `El problema que resuelve es ${project.pitch_problema_resuelve}. `}
              {project.pitch_ia_adentro && `La IA adentro: ${project.pitch_ia_adentro}. `}
              {project.pitch_se_llama_asi_porque &&
                `Se llama así porque ${project.pitch_se_llama_asi_porque}.`}
            </p>
          </div>

          {(project.ods || project.evidencia_indagacion || project.ficha_usuario || project.prototipo_link) && (
            <div className="rounded-lg border border-black/10 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                Programa de 4 semanas
              </p>
              <div className="mt-2 flex flex-col gap-3">
                <Campo label="ODS" valor={project.ods} />
                <Campo label="Evidencia de indagación" valor={project.evidencia_indagacion} />
                <Campo label="Ficha de usuario" valor={project.ficha_usuario} />
                <Campo label="Tipo de prototipo" valor={project.prototipo_tipo} />
                <Campo label="Link del prototipo" valor={project.prototipo_link} />
              </div>
            </div>
          )}
        </div>

        <h2 className="mt-8 text-xl font-bold">Rúbrica</h2>
        <RubricaForm projectId={project.id} evaluacionInicial={miEvaluacion} />
      </div>
    </main>
  );
}
