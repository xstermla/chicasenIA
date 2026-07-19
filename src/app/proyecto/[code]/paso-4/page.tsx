import { redirect } from "next/navigation";
import { getEquipoYProyecto, getBocetoSignedUrl } from "../data";
import StepNav from "../StepNav";
import EnviadoBanner from "../EnviadoBanner";
import Paso4Form from "./Paso4Form";

export default async function Paso4Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const equipo = await getEquipoYProyecto(code);
  if (!equipo) redirect("/");

  const bocetoUrl = await getBocetoSignedUrl(equipo.project.boceto_url);

  return (
    <main className="flex flex-1 flex-col pb-10">
      <StepNav code={code} actual="paso-4" />
      <div className="mx-auto w-full max-w-md px-6">
        <h1 className="text-2xl font-bold">Dibuja una pantalla</h1>
        <p className="mt-1 text-foreground/70">
          ¿Qué ve alguien cuando abre tu app por primera vez? Dibuja aquí la
          pantalla principal de tu app.
        </p>
        {equipo.project.status === "enviado" && <EnviadoBanner />}
        <Paso4Form code={code} bocetoUrlInicial={bocetoUrl} />
      </div>
    </main>
  );
}
