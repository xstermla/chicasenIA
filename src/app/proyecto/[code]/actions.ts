"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEquipoYProyecto } from "./data";
import type { Project } from "@/lib/database.types";

export interface GuardarState {
  error?: string;
  guardado?: boolean;
}

const IA_FUNCIONES_VALIDAS = [
  "Responder preguntas",
  "Conectar personas",
  "Alertar o avisar",
  "Recomendar opciones",
  "Traducir o explicar",
  "Reconocer imágenes",
];

function campoTexto(formData: FormData, campo: string): string | null {
  const v = formData.get(campo);
  if (v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

async function actualizarProyecto(
  code: string,
  patch: Partial<Project>
): Promise<{ error?: string }> {
  const equipo = await getEquipoYProyecto(code);
  if (!equipo) return { error: "Código inválido." };
  if (equipo.project.status === "enviado") {
    return { error: "Este proyecto ya fue enviado. Pedile a tu docente que lo reabra para editarlo." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("projects")
    .update(patch)
    .eq("team_id", equipo.team.id);

  if (error) return { error: "No pudimos guardar. Probá de nuevo." };
  return {};
}

async function siguienteORedirect(formData: FormData) {
  const next = formData.get("next");
  if (next) redirect(String(next));
}

export async function guardarPaso1(code: string, _prev: GuardarState, formData: FormData) {
  const { error } = await actualizarProyecto(code, {
    problema: campoTexto(formData, "problema"),
  });
  if (error) return { error };
  await siguienteORedirect(formData);
  return { guardado: true };
}

export async function guardarPaso2(code: string, _prev: GuardarState, formData: FormData) {
  const { error } = await actualizarProyecto(code, {
    para_quien: campoTexto(formData, "para_quien"),
  });
  if (error) return { error };
  await siguienteORedirect(formData);
  return { guardado: true };
}

export async function guardarPaso3(code: string, _prev: GuardarState, formData: FormData) {
  const funciones = formData
    .getAll("ia_funciones")
    .map(String)
    .filter((f) => IA_FUNCIONES_VALIDAS.includes(f));

  const { error } = await actualizarProyecto(code, {
    ia_funciones: funciones,
    ia_otra: campoTexto(formData, "ia_otra"),
  });
  if (error) return { error };
  await siguienteORedirect(formData);
  return { guardado: true };
}

export async function guardarPaso5(code: string, _prev: GuardarState, formData: FormData) {
  const { error } = await actualizarProyecto(code, {
    nombre_app: campoTexto(formData, "nombre_app"),
    nombre_por_que: campoTexto(formData, "nombre_por_que"),
  });
  if (error) return { error };
  await siguienteORedirect(formData);
  return { guardado: true };
}

export interface EnviarState {
  error?: string;
}

async function validarYEnviar(code: string): Promise<EnviarState> {
  const equipo = await getEquipoYProyecto(code);
  if (!equipo) return { error: "Código inválido." };
  if (equipo.project.status === "enviado") {
    redirect(`/proyecto/${code}/gracias`);
  }

  const { problema, para_quien, nombre_app, ia_funciones, ia_otra } = equipo.project;
  const faltantes: string[] = [];
  if (!problema) faltantes.push("el problema (paso 1)");
  if (!para_quien) faltantes.push("para quién es la app (paso 2)");
  if (!(ia_funciones && ia_funciones.length) && !ia_otra) faltantes.push("qué haría la IA (paso 3)");
  if (!nombre_app) faltantes.push("el nombre de la app (paso 5)");

  if (faltantes.length) {
    return { error: `Antes de enviar, completá: ${faltantes.join(", ")}.` };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("projects")
    .update({ status: "enviado", submitted_at: new Date().toISOString() })
    .eq("team_id", equipo.team.id);

  if (error) return { error: "No pudimos enviar el proyecto. Probá de nuevo." };

  redirect(`/proyecto/${code}/gracias`);
}

export async function enviarProyecto(code: string, _prev: EnviarState): Promise<EnviarState> {
  return validarYEnviar(code);
}

export async function guardarPitch(code: string, _prev: GuardarState, formData: FormData) {
  const prototipoTipo = campoTexto(formData, "prototipo_tipo");

  const { error } = await actualizarProyecto(code, {
    pitch_se_llama: campoTexto(formData, "pitch_se_llama"),
    pitch_la_creamos_para: campoTexto(formData, "pitch_la_creamos_para"),
    pitch_problema_resuelve: campoTexto(formData, "pitch_problema_resuelve"),
    pitch_ia_adentro: campoTexto(formData, "pitch_ia_adentro"),
    pitch_se_llama_asi_porque: campoTexto(formData, "pitch_se_llama_asi_porque"),
    ods: campoTexto(formData, "ods"),
    evidencia_indagacion: campoTexto(formData, "evidencia_indagacion"),
    ficha_usuario: campoTexto(formData, "ficha_usuario"),
    prototipo_tipo: (prototipoTipo as Project["prototipo_tipo"]) ?? null,
    prototipo_link: campoTexto(formData, "prototipo_link"),
  });
  if (error) return { error };

  const next = formData.get("next");
  if (next === "ENVIAR") return validarYEnviar(code);
  if (next) redirect(String(next));
  return { guardado: true };
}

export interface SubirBocetoState {
  error?: string;
  ok?: boolean;
}

export async function subirBoceto(
  code: string,
  _prev: SubirBocetoState,
  formData: FormData
): Promise<SubirBocetoState> {
  const equipo = await getEquipoYProyecto(code);
  if (!equipo) return { error: "Código inválido." };
  if (equipo.project.status === "enviado") {
    return { error: "Este proyecto ya fue enviado. Pedile a tu docente que lo reabra para editarlo." };
  }

  const file = formData.get("boceto");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Elegí o sacá una foto del boceto." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "El archivo tiene que ser una imagen." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: "La imagen pesa demasiado (máx. 8 MB)." };
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${equipo.team.id}/boceto-${Date.now()}.${ext}`;

  const admin = createAdminClient();
  const { error: uploadError } = await admin.storage
    .from("bocetos")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: "No pudimos subir la imagen. Probá de nuevo." };

  const { error: updateError } = await admin
    .from("projects")
    .update({ boceto_url: path })
    .eq("team_id", equipo.team.id);

  if (updateError) return { error: "La imagen se subió pero no pudimos guardarla en el proyecto." };

  return { ok: true };
}
