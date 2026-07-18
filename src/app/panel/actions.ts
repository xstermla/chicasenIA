"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Nivel } from "@/lib/rubrica";

export interface GuardarEvaluacionState {
  error?: string;
  guardado?: boolean;
}

function nivelValido(v: FormDataEntryValue | null): Nivel | null {
  const n = Number(v);
  return n === 1 || n === 2 || n === 3 ? (n as Nivel) : null;
}

export async function guardarEvaluacion(
  projectId: string,
  _prev: GuardarEvaluacionState,
  formData: FormData
): Promise<GuardarEvaluacionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Volvé a ingresar." };

  const scores = {
    score_eje1: nivelValido(formData.get("score_eje1")),
    score_eje2: nivelValido(formData.get("score_eje2")),
    score_eje3: nivelValido(formData.get("score_eje3")),
    score_eje4: nivelValido(formData.get("score_eje4")),
  };

  const feedback = {
    feedback_eje1: String(formData.get("feedback_eje1") ?? "").trim() || null,
    feedback_eje2: String(formData.get("feedback_eje2") ?? "").trim() || null,
    feedback_eje3: String(formData.get("feedback_eje3") ?? "").trim() || null,
    feedback_eje4: String(formData.get("feedback_eje4") ?? "").trim() || null,
  };

  const { data: existente } = await supabase
    .from("evaluations")
    .select("id")
    .eq("project_id", projectId)
    .eq("evaluator_id", user.id)
    .maybeSingle();

  const { error } = existente
    ? await supabase
        .from("evaluations")
        .update({ ...scores, ...feedback })
        .eq("id", existente.id)
    : await supabase
        .from("evaluations")
        .insert({ project_id: projectId, evaluator_id: user.id, ...scores, ...feedback });

  if (error) return { error: "No pudimos guardar la evaluación. Probá de nuevo." };

  revalidatePath(`/panel/proyecto/${projectId}`);
  revalidatePath("/panel");
  return { guardado: true };
}

export interface ReabrirState {
  error?: string;
}

export async function reabrirProyecto(
  projectId: string,
  _prev: ReabrirState
): Promise<ReabrirState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Volvé a ingresar." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role === "evaluadora") {
    return { error: "Solo la docente o la administradora pueden reabrir un proyecto." };
  }

  const { error } = await supabase
    .from("projects")
    .update({ status: "borrador" })
    .eq("id", projectId);

  if (error) return { error: "No pudimos reabrir el proyecto. Probá de nuevo." };

  revalidatePath(`/panel/proyecto/${projectId}`);
  revalidatePath("/panel");
  return {};
}
