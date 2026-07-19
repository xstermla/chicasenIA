import Image from "next/image";
import { getPerfilActual } from "./data";
import { logout } from "@/app/login/actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getPerfilActual();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-black/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/chicas-en-ia-logo.png"
            alt="Chicas en IA"
            width={120}
            height={30}
          />
          <Image src="/brand/xstem-logo.svg" alt="XSTEM" width={84} height={27} unoptimized />
          <p className="text-xs text-foreground/60">{profile.full_name ?? "Panel"}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-black/15 px-3 py-2 text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </form>
      </header>
      {!profile.institution_id && profile.role !== "admin" ? (
        <main className="flex flex-1 items-center justify-center px-6 py-12 text-center">
          <p className="max-w-sm text-foreground/70">
            Tu cuenta todavía no tiene una institución asignada. Pedile a la
            administradora del programa que la configure.
          </p>
        </main>
      ) : (
        children
      )}
    </div>
  );
}
