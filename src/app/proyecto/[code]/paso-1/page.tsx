import { redirect } from "next/navigation";
import { getEquipoYProyecto } from "../data";
import StepNav from "../StepNav";
import EnviadoBanner from "../EnviadoBanner";
import Paso1Form from "./Paso1Form";

export default async function Paso1Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const equipo = await getEquipoYProyecto(code);
  if (!equipo) redirect("/");

  return (
    <main className="flex flex-1 flex-col pb-10">
      <StepNav code={code} actual="paso-1" />
      <div className="mx-auto w-full max-w-md px-6">
        <h1 className="text-2xl font-bold">¿Qué problema queremos resolver?</h1>
        <p className="mt-1 text-foreground/70">
          Algo real, que les pase a ustedes o a alguien cercano.
        </p>
        {equipo.project.status === "enviado" && <EnviadoBanner />}
        <Paso1Form code={code} problemaInicial={equipo.project.problema ?? ""} />
      </div>
    </main>
  );
}
