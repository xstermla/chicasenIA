import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Project, Team } from "@/lib/database.types";

export interface EquipoYProyecto {
  team: Team;
  project: Project;
}

// Los equipos no tienen cuenta de Auth: su única credencial es el
// access_code. Esta consulta corre siempre con la service_role key
// (nunca se expone al cliente) y hace las veces de "endpoint" que valida
// el código antes de dejar leer o escribir el proyecto.
export async function getEquipoYProyecto(code: string): Promise<EquipoYProyecto | null> {
  const admin = createAdminClient();
  const accessCode = code.trim().toUpperCase();

  const { data: team, error: teamError } = await admin
    .from("teams")
    .select("*")
    .eq("access_code", accessCode)
    .maybeSingle();

  if (teamError || !team) return null;

  const { data: project, error: projectError } = await admin
    .from("projects")
    .select("*")
    .eq("team_id", team.id)
    .maybeSingle();

  if (projectError || !project) return null;

  return { team, project };
}

export const BOCETO_SIGNED_URL_TTL = 60 * 10; // 10 minutos

export async function getBocetoSignedUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("bocetos")
    .createSignedUrl(path, BOCETO_SIGNED_URL_TTL);

  if (error) return null;
  return data.signedUrl;
}
