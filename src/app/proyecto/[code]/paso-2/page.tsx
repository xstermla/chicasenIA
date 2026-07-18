import { redirect } from "next/navigation";
import { getEquipoYProyecto } from "../data";
import StepNav from "../StepNav";
import EnviadoBanner from "../EnviadoBanner";
import Paso2Form from "./Paso2Form";

export default async function Paso2Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const equipo = await getEquipoYProyecto(code);
  if (!equipo) redirect("/");

  return (
    <main className="flex flex-1 flex-col pb-10">
      <StepNav code={code} actual="paso-2" />
      <div className="mx-auto w-full max-w-md px-6">
        <h1 className="text-2xl font-bold">¿Para quién es esta app?</h1>
        <p className="mt-1 text-foreground/70">
          Edad, dónde vive, qué necesita.
        </p>
        {equipo.project.status === "enviado" && <EnviadoBanner />}
        <Paso2Form code={code} paraQuienInicial={equipo.project.para_quien ?? ""} />
      </div>
    </main>
  );
}
