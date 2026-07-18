import Link from "next/link";
import { redirect } from "next/navigation";
import { getEquipoYProyecto } from "./data";

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const equipo = await getEquipoYProyecto(code);

  if (!equipo) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-2xl font-bold">Código inválido</h1>
        <p className="mt-2 text-foreground/70">
          Revisá el código de acceso de tu equipo e intentá de nuevo.
        </p>
        <Link href="/" className="mt-6 font-semibold text-brand">
          Volver al inicio
        </Link>
      </main>
    );
  }

  if (equipo.project.status === "enviado") {
    redirect(`/proyecto/${code}/gracias`);
  }

  redirect(`/proyecto/${code}/paso-1`);
}
