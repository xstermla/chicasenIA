import { redirect } from "next/navigation";
import { getEquipoYProyecto } from "../data";
import StepNav from "../StepNav";
import EnviadoBanner from "../EnviadoBanner";
import PitchForm from "./PitchForm";

export default async function PitchPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const equipo = await getEquipoYProyecto(code);
  if (!equipo) redirect("/");

  const { project } = equipo;

  return (
    <main className="flex flex-1 flex-col pb-10">
      <StepNav code={code} actual="pitch" />
      <div className="mx-auto w-full max-w-md px-6">
        <h1 className="text-2xl font-bold">Pitch de 60 segundos</h1>
        <p className="mt-1 text-foreground/70">
          Completa estas frases para preparar tu presentación.
        </p>
        {project.status === "enviado" && <EnviadoBanner />}
        <PitchForm
          code={code}
          valoresIniciales={{
            pitch_se_llama: project.pitch_se_llama ?? project.nombre_app ?? "",
            pitch_la_creamos_para: project.pitch_la_creamos_para ?? "",
            pitch_problema_resuelve: project.pitch_problema_resuelve ?? "",
            pitch_ia_adentro: project.pitch_ia_adentro ?? "",
            pitch_se_llama_asi_porque:
              project.pitch_se_llama_asi_porque ?? project.nombre_por_que ?? "",
          }}
        />
      </div>
    </main>
  );
}
