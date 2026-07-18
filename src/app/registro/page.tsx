import { listInstituciones } from "./actions";
import RegistroForm from "./RegistroForm";

export default async function RegistroPage() {
  const instituciones = await listInstituciones();

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold">Registrar mi equipo</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Completá estos datos para crear el proyecto de tu equipo.
        </p>

        <RegistroForm instituciones={instituciones} />
      </div>
    </main>
  );
}
