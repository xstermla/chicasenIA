import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { escalaLabel } from "@/lib/rubrica";
import type { Evaluation } from "@/lib/database.types";

function csvEscape(valor: string | number | null | undefined): string {
  const s = valor === null || valor === undefined ? "" : String(valor);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role === "evaluadora") {
    return NextResponse.json(
      { error: "La exportación a CSV es solo para docentes y administradoras." },
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

  const encabezado = [
    "Cohorte",
    "Equipo",
    "Integrantes",
    "Estado",
    "Enviado el",
    "Eje 1 - Problema",
    "Eje 2 - Design Thinking",
    "Eje 3 - Prototipo",
    "Eje 4 - Pitch",
    "Total",
    "Escala",
  ];

  const filas = (teams ?? []).map((team) => {
    const project = projectsByTeamId.get(team.id);
    const cohort = cohortsById.get(team.cohort_id);
    const ev = project ? evaluacionMasRecientePorProyecto.get(project.id) : undefined;

    return [
      cohort?.name ?? "",
      team.team_name,
      (team.members ?? []).join(" / "),
      project?.status === "enviado" ? "Enviado" : "Borrador",
      project?.submitted_at ?? "",
      ev?.score_eje1 ?? "",
      ev?.score_eje2 ?? "",
      ev?.score_eje3 ?? "",
      ev?.score_eje4 ?? "",
      ev?.total_score ?? "",
      ev ? escalaLabel(ev.total_score) : "",
    ];
  });

  const csv = [encabezado, ...filas]
    .map((fila) => fila.map(csvEscape).join(","))
    .join("\n");

  const BOM = "﻿"; // para que Excel detecte UTF-8 correctamente
  return new NextResponse(`${BOM}${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="chicas-en-ia-equipos.csv"`,
    },
  });
}
