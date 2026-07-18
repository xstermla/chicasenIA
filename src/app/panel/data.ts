import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Cohort, Evaluation, Profile, Project, Team } from "@/lib/database.types";

export interface PerfilActual {
  userId: string;
  profile: Profile;
}

// Todas las consultas de este archivo corren con el cliente de sesión (no el
// de service_role): quedan acotadas automáticamente por las políticas RLS
// de supabase/02_policies.sql según la institución de la usuaria logueada.
export async function getPerfilActual(): Promise<PerfilActual> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile) redirect("/login");

  return { userId: user.id, profile };
}

export interface EquipoConProyecto {
  team: Team;
  cohort: Cohort | null;
  project: Project | null;
  miEvaluacion: Evaluation | null;
}

export async function getEquiposConProyectos(userId: string): Promise<EquipoConProyecto[]> {
  const supabase = await createClient();

  const [{ data: teams }, { data: cohorts }, { data: projects }, { data: evaluations }] =
    await Promise.all([
      supabase.from("teams").select("*").order("team_name"),
      supabase.from("cohorts").select("*"),
      supabase.from("projects").select("*"),
      supabase.from("evaluations").select("*").eq("evaluator_id", userId),
    ]);

  const cohortsById = new Map((cohorts ?? []).map((c) => [c.id, c]));
  const projectsByTeamId = new Map((projects ?? []).map((p) => [p.team_id, p]));
  const evaluationsByProjectId = new Map((evaluations ?? []).map((e) => [e.project_id, e]));

  return (teams ?? []).map((team) => {
    const project = projectsByTeamId.get(team.id) ?? null;
    return {
      team,
      cohort: cohortsById.get(team.cohort_id) ?? null,
      project,
      miEvaluacion: project ? evaluationsByProjectId.get(project.id) ?? null : null,
    };
  });
}

export interface ProyectoDetalle {
  team: Team;
  cohort: Cohort | null;
  project: Project;
  miEvaluacion: Evaluation | null;
}

export async function getProyectoDetalle(projectId: string): Promise<ProyectoDetalle | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) return null;

  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("id", project.team_id)
    .maybeSingle();

  if (!team) return null;

  const { data: cohort } = await supabase
    .from("cohorts")
    .select("*")
    .eq("id", team.cohort_id)
    .maybeSingle();

  const { data: miEvaluacion } = await supabase
    .from("evaluations")
    .select("*")
    .eq("project_id", project.id)
    .eq("evaluator_id", user.id)
    .maybeSingle();

  return { team, cohort: cohort ?? null, project, miEvaluacion: miEvaluacion ?? null };
}

// El bucket es privado y sin policies propias: para que la docente/evaluadora
// pueda ver el boceto generamos la URL firmada con la service_role key (la
// sesión de la usuaria no tiene grants de storage).
export async function getBocetoSignedUrlPanel(path: string | null): Promise<string | null> {
  if (!path) return null;
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("bocetos").createSignedUrl(path, 60 * 10);
  if (error) return null;
  return data.signedUrl;
}
