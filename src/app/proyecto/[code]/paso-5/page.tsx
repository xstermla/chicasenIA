import { redirect } from "next/navigation";
import { getEquipoYProyecto } from "../data";
import StepNav from "../StepNav";
import EnviadoBanner from "../EnviadoBanner";
import Paso5Form from "./Paso5Form";

export default async function Paso5Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const equipo = await getEquipoYProyecto(code);
  if (!equipo) redirect("/");

  return (
    <main className="flex flex-1 flex-col pb-10">
      <StepNav code={code} actual="paso-5" />
      <div className="mx-auto w-full max-w-md px-6">
        <h1 className="text-2xl font-bold">El nombre</h1>
        <p className="mt-1 text-foreground/70">
          ¿Cómo se llama? ¿Por qué ese nombre?
        </p>
        {equipo.project.status === "enviado" && <EnviadoBanner />}
        <Paso5Form
          code={code}
          nombreInicial={equipo.project.nombre_app ?? ""}
          porQueInicial={equipo.project.nombre_por_que ?? ""}
        />
      </div>
    </main>
  );
}
