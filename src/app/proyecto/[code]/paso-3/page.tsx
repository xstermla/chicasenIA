import { redirect } from "next/navigation";
import { getEquipoYProyecto } from "../data";
import StepNav from "../StepNav";
import EnviadoBanner from "../EnviadoBanner";
import Paso3Form from "./Paso3Form";

export default async function Paso3Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const equipo = await getEquipoYProyecto(code);
  if (!equipo) redirect("/");

  return (
    <main className="flex flex-1 flex-col pb-10">
      <StepNav code={code} actual="paso-3" />
      <div className="mx-auto w-full max-w-md px-6">
        <h1 className="text-2xl font-bold">¿Qué haría la IA en tu app?</h1>
        <p className="mt-1 text-foreground/70">
          Marca las que aplican (pueden ser varias):
        </p>
        {equipo.project.status === "enviado" && <EnviadoBanner />}
        <Paso3Form
          code={code}
          iaFuncionesIniciales={equipo.project.ia_funciones ?? []}
          iaOtraInicial={equipo.project.ia_otra ?? ""}
        />
      </div>
    </main>
  );
}
