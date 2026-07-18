import BrandHeader from "@/components/BrandHeader";
import RegistroForm from "./RegistroForm";

export default function RegistroPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-10">
      <div className="w-full max-w-md">
        <BrandHeader compact />
        <h1 className="mt-4 text-2xl font-bold">Registrar mi equipo</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Completá estos datos para crear el proyecto de tu equipo.
        </p>

        <RegistroForm />
      </div>
    </main>
  );
}
