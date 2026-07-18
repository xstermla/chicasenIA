"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generarAccessCode } from "@/lib/access-code";
import type { CohortPublic, InstitutionPublic } from "@/lib/database.types";

export async function listInstituciones(): Promise<InstitutionPublic[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("institutions_public")
    .select("id, name")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function listCohortes(institutionId: string): Promise<CohortPublic[]> {
  if (!institutionId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cohorts_public")
    .select("id, institution_id, name, demo_day_date")
    .eq("institution_id", institutionId)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export interface RegistrarEquipoState {
  success: boolean;
  accessCode?: string;
  teamName?: string;
  error?: string;
}

export async function registrarEquipo(
  _prev: RegistrarEquipoState,
  formData: FormData
): Promise<RegistrarEquipoState> {
  const teamName = String(formData.get("team_name") ?? "").trim();
  const cohortId = String(formData.get("cohort_id") ?? "").trim();
  const membersRaw = String(formData.get("members") ?? "");

  const members = membersRaw
    .split(/\n|,/)
    .map((m) => m.trim())
    .filter(Boolean);

  if (!teamName) {
    return { success: false, error: "Falta el nombre del equipo." };
  }
  if (!cohortId) {
    return { success: false, error: "Elegí la institución y la cohorte." };
  }
  if (members.length === 0) {
    return { success: false, error: "Sumá al menos una integrante del equipo." };
  }

  const admin = createAdminClient();

  let accessCode = "";
  let teamId: string | null = null;

  for (let intento = 0; intento < 5 && !teamId; intento++) {
    accessCode = generarAccessCode();
    const { data, error } = await admin
      .from("teams")
      .insert({
        cohort_id: cohortId,
        team_name: teamName,
        members,
        access_code: accessCode,
      })
      .select("id")
      .single();

    if (error) {
      // 23505 = violación de unicidad de access_code: reintentamos con otro código.
      if (error.code === "23505") continue;
      return { success: false, error: "No pudimos registrar el equipo. Probá de nuevo." };
    }
    teamId = data.id;
  }

  if (!teamId) {
    return { success: false, error: "No pudimos generar un código único. Probá de nuevo." };
  }

  const { error: projectError } = await admin.from("projects").insert({ team_id: teamId });
  if (projectError) {
    return { success: false, error: "El equipo se creó pero hubo un error al iniciar el proyecto." };
  }

  return { success: true, accessCode, teamName };
}
