import ExcelJS from "exceljs";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { escalaLabel } from "@/lib/rubrica";
import type { Evaluation } from "@/lib/database.types";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role === "evaluadora") {
    return NextResponse.json(
      { error: "La exportación es solo para docentes y administradoras." },
      { status: 403 }
    );
  }

  const [
    { data: teams },
    { data: cohorts },
    { data: institutions },
    { data: projects },
    { data: evaluations },
  ] = await Promise.all([
    supabase.from("teams").select("*").order("team_name"),
    supabase.from("cohorts").select("*"),
    supabase.from("institutions").select("*"),
    supabase.from("projects").select("*"),
    supabase.from("evaluations").select("*").order("created_at", { ascending: false }),
  ]);

  const cohortsById = new Map((cohorts ?? []).map((c) => [c.id, c]));
  const institutionsById = new Map((institutions ?? []).map((i) => [i.id, i]));
  const projectsByTeamId = new Map((projects ?? []).map((p) => [p.team_id, p]));
  const evaluacionMasRecientePorProyecto = new Map<string, Evaluation>();
  for (const ev of evaluations ?? []) {
    if (!evaluacionMasRecientePorProyecto.has(ev.project_id)) {
      evaluacionMasRecientePorProyecto.set(ev.project_id, ev);
    }
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Chicas en IA";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Equipos");
  sheet.columns = [
    { header: "Institución", key: "institucion", width: 20 },
    { header: "Cohorte", key: "cohorte", width: 12 },
    { header: "Equipo", key: "equipo", width: 22 },
    { header: "Integrantes", key: "integrantes", width: 30 },
    { header: "Estado", key: "estado", width: 12 },
    { header: "Enviado el", key: "enviado", width: 18 },
    { header: "Problema", key: "problema", width: 40 },
    { header: "Para quién", key: "para_quien", width: 40 },
    { header: "Qué haría la IA", key: "ia_funciones", width: 40 },
    { header: "Nombre de la app", key: "nombre_app", width: 20 },
    { header: "Por qué ese nombre", key: "nombre_por_que", width: 40 },
    { header: "Pitch: se llama", key: "pitch_se_llama", width: 20 },
    { header: "Pitch: la creamos para", key: "pitch_la_creamos_para", width: 34 },
    { header: "Pitch: problema que resuelve", key: "pitch_problema_resuelve", width: 34 },
    { header: "Pitch: la IA adentro", key: "pitch_ia_adentro", width: 34 },
    { header: "Pitch: se llama así porque", key: "pitch_se_llama_asi_porque", width: 34 },
    { header: "Eje 1 - Problema", key: "eje1", width: 16 },
    { header: "Eje 2 - Design Thinking", key: "eje2", width: 18 },
    { header: "Eje 3 - Prototipo", key: "eje3", width: 16 },
    { header: "Eje 4 - Pitch", key: "eje4", width: 14 },
    { header: "Total", key: "total", width: 10 },
    { header: "Escala", key: "escala", width: 26 },
  ];

  const encabezado = sheet.getRow(1);
  encabezado.font = { bold: true, color: { argb: "FFFFFFFF" } };
  encabezado.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF7F3F98" },
  };
  encabezado.alignment = { vertical: "middle", wrapText: true };

  for (const team of teams ?? []) {
    const project = projectsByTeamId.get(team.id);
    const cohort = cohortsById.get(team.cohort_id);
    const institution = cohort ? institutionsById.get(cohort.institution_id) : undefined;
    const ev = project ? evaluacionMasRecientePorProyecto.get(project.id) : undefined;

    const funciones = [...(project?.ia_funciones ?? []), project?.ia_otra]
      .filter(Boolean)
      .join(" / ");

    const row = sheet.addRow({
      institucion: institution?.name ?? "",
      cohorte: cohort?.name ?? "",
      equipo: team.team_name,
      integrantes: (team.members ?? []).join(" / "),
      estado: project?.status === "enviado" ? "Enviado" : "Borrador",
      enviado: project?.submitted_at
        ? new Date(project.submitted_at).toLocaleString("es")
        : "",
      problema: project?.problema ?? "",
      para_quien: project?.para_quien ?? "",
      ia_funciones: funciones,
      nombre_app: project?.nombre_app ?? "",
      nombre_por_que: project?.nombre_por_que ?? "",
      pitch_se_llama: project?.pitch_se_llama ?? "",
      pitch_la_creamos_para: project?.pitch_la_creamos_para ?? "",
      pitch_problema_resuelve: project?.pitch_problema_resuelve ?? "",
      pitch_ia_adentro: project?.pitch_ia_adentro ?? "",
      pitch_se_llama_asi_porque: project?.pitch_se_llama_asi_porque ?? "",
      eje1: ev?.score_eje1 ?? "",
      eje2: ev?.score_eje2 ?? "",
      eje3: ev?.score_eje3 ?? "",
      eje4: ev?.score_eje4 ?? "",
      total: ev?.total_score ?? "",
      escala: ev ? escalaLabel(ev.total_score) : "Sin evaluar",
    });
    row.alignment = { wrapText: true, vertical: "top" };
  }

  sheet.autoFilter = { from: "A1", to: "V1" };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="chicas-en-ia-equipos.xlsx"`,
    },
  });
}
