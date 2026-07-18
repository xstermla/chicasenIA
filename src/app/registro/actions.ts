"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { generarAccessCode } from "@/lib/access-code";

// La cohorte no se le pide al equipo: todas las instituciones que se
// registran hoy caen en la cohorte "2026" (se crea sola la primera vez
// que una institución se registra).
const COHORTE_ACTUAL = "2026";

async function obtenerOCrearInstitucion(
  admin: ReturnType<typeof createAdminClient>,
  nombre: string
): Promise<{ id: string } | { error: string }> {
  const { data: existente, error: buscarError } = await admin
    .from("institutions")
    .select("id")
    .ilike("name", nombre)
    .maybeSingle();

  if (buscarError) return { error: "No pudimos validar la institución. Probá de nuevo." };
  if (existente) return { id: existente.id };

  const { data: nueva, error: crearError } = await admin
    .from("institutions")
    .insert({ name: nombre })
    .select("id")
    .single();

  if (crearError || !nueva) return { error: "No pudimos crear la institución. Probá de nuevo." };
  return { id: nueva.id };
}

async function obtenerOCrearCohorte(
  admin: ReturnType<typeof createAdminClient>,
  institutionId: string
): Promise<{ id: string } | { error: string }> {
  const { data: existente, error: buscarError } = await admin
    .from("cohorts")
    .select("id")
    .eq("institution_id", institutionId)
    .eq("name", COHORTE_ACTUAL)
    .maybeSingle();

  if (buscarError) return { error: "No pudimos validar la cohorte. Probá de nuevo." };
  if (existente) return { id: existente.id };

  const { data: nueva, error: crearError } = await admin
    .from("cohorts")
    .insert({ institution_id: institutionId, name: COHORTE_ACTUAL })
    .select("id")
    .single();

  if (crearError || !nueva) return { error: "No pudimos crear la cohorte. Probá de nuevo." };
  return { id: nueva.id };
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
  const institutionName = String(formData.get("institution") ?? "").trim();
  const membersRaw = String(formData.get("members") ?? "");

  const members = membersRaw
    .split(/\n|,/)
    .map((m) => m.trim())
    .filter(Boolean);

  if (!teamName) {
    return { success: false, error: "Falta el nombre del equipo." };
  }
  if (!institutionName) {
    return { success: false, error: "Falta el nombre de la institución." };
  }
  if (members.length === 0) {
    return { success: false, error: "Sumá al menos una integrante del equipo." };
  }

  const admin = createAdminClient();

  const institucion = await obtenerOCrearInstitucion(admin, institutionName);
  if ("error" in institucion) return { success: false, error: institucion.error };

  const cohorte = await obtenerOCrearCohorte(admin, institucion.id);
  if ("error" in cohorte) return { success: false, error: cohorte.error };

  let accessCode = "";
  let teamId: string | null = null;

  for (let intento = 0; intento < 5 && !teamId; intento++) {
    accessCode = generarAccessCode();
    const { data, error } = await admin
      .from("teams")
      .insert({
        cohort_id: cohorte.id,
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
