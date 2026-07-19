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

  const [{ data: teams }, { data: cohorts }, { data: projects }, { data: evaluations }] =
    await Promise.all([
      supabase.from("teams").select("*").order("team_name"),
      supabase.from("cohorts").select("*"),
      supabase.from("projects").select("*"),
      supabase.from("evaluations").select("*").order("created_at", { ascending: false }),
    ]);

  const cohortsById = new Map((cohorts ?? []).map((c) => [c.id, c]));
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
    { header: "Cohorte", key: "cohorte", width: 14 },
    { header: "Equipo", key: "equipo", width: 24 },
    { header: "Integrantes", key: "integrantes", width: 32 },
    { header: "Estado", key: "estado", width: 12 },
    { header: "Enviado el", key: "enviado", width: 18 },
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
  encabezado.alignment = { vertical: "middle" };

  for (const team of teams ?? []) {
    const project = projectsByTeamId.get(team.id);
    const cohort = cohortsById.get(team.cohort_id);
    const ev = project ? evaluacionMasRecientePorProyecto.get(project.id) : undefined;

    sheet.addRow({
      cohorte: cohort?.name ?? "",
      equipo: team.team_name,
      integrantes: (team.members ?? []).join(" / "),
      estado: project?.status === "enviado" ? "Enviado" : "Borrador",
      enviado: project?.submitted_at
        ? new Date(project.submitted_at).toLocaleString("es")
        : "",
      eje1: ev?.score_eje1 ?? "",
      eje2: ev?.score_eje2 ?? "",
      eje3: ev?.score_eje3 ?? "",
      eje4: ev?.score_eje4 ?? "",
      total: ev?.total_score ?? "",
      escala: ev ? escalaLabel(ev.total_score) : "Sin evaluar",
    });
  }

  sheet.autoFilter = { from: "A1", to: "K1" };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="chicas-en-ia-equipos.xlsx"`,
    },
  });
}
