import { redirect } from "next/navigation";
import { getEquipoYProyecto } from "../data";

export default async function GraciasPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const equipo = await getEquipoYProyecto(code);
  if (!equipo) redirect("/");
  if (equipo.project.status !== "enviado") redirect(`/proyecto/${code}/paso-1`);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          ¡Proyecto enviado!
        </p>
        <h1 className="mt-2 text-2xl font-bold">{equipo.team.team_name}</h1>
        <p className="mt-4 text-base text-foreground/80">
          Esta idea es de ustedes. Pueden seguir desarrollándola en la
          plataforma y en la comunidad.
        </p>
      </div>
    </main>
  );
}
