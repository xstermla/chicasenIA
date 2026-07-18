"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { EJES, NIVEL_LABEL, totalScore, escalaLabel, type Nivel } from "@/lib/rubrica";
import { guardarEvaluacion, type GuardarEvaluacionState } from "../../actions";
import type { Evaluation } from "@/lib/database.types";

const NIVELES: Nivel[] = [3, 2, 1];

interface EjeState {
  nivel: Nivel | null;
  feedback: string;
}

function estadoInicial(eval_: Evaluation | null): Record<string, EjeState> {
  const campoScore = { eje1: eval_?.score_eje1, eje2: eval_?.score_eje2, eje3: eval_?.score_eje3, eje4: eval_?.score_eje4 };
  const campoFeedback = {
    eje1: eval_?.feedback_eje1,
    eje2: eval_?.feedback_eje2,
    eje3: eval_?.feedback_eje3,
    eje4: eval_?.feedback_eje4,
  };
  const estado: Record<string, EjeState> = {};
  for (const eje of EJES) {
    estado[eje.key] = {
      nivel: (campoScore[eje.key] as Nivel | null | undefined) ?? null,
      feedback: campoFeedback[eje.key] ?? "",
    };
  }
  return estado;
}

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-brand px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
    >
      {pending ? "Guardando..." : "Guardar evaluación"}
    </button>
  );
}

export default function RubricaForm({
  projectId,
  evaluacionInicial,
}: {
  projectId: string;
  evaluacionInicial: Evaluation | null;
}) {
  const [ejesState, setEjesState] = useState<Record<string, EjeState>>(() =>
    estadoInicial(evaluacionInicial)
  );
  const action = guardarEvaluacion.bind(null, projectId);
  const [state, formAction] = useActionState<GuardarEvaluacionState, FormData>(action, {});

  const total = totalScore({
    eje1: ejesState.eje1?.nivel ?? null,
    eje2: ejesState.eje2?.nivel ?? null,
    eje3: ejesState.eje3?.nivel ?? null,
    eje4: ejesState.eje4?.nivel ?? null,
  });

  function elegirNivel(ejeKey: string, nivel: Nivel, feedbackSugerido: string) {
    setEjesState((prev) => {
      const actual = prev[ejeKey];
      const feedbackPrevioEraSugerido =
        !actual.feedback ||
        EJES.some((e) => e.key === ejeKey && Object.values(e.feedback).includes(actual.feedback));
      return {
        ...prev,
        [ejeKey]: {
          nivel,
          feedback: feedbackPrevioEraSugerido ? feedbackSugerido : actual.feedback,
        },
      };
    });
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-8">
      <div className="sticky top-0 z-10 -mx-4 border-b border-black/10 bg-background/95 px-4 py-3 backdrop-blur">
        <p className="text-sm font-semibold text-brand-dark">
          Puntaje total: {total}/12 · {escalaLabel(total)}
        </p>
      </div>

      {EJES.map((eje) => {
        const ejeState = ejesState[eje.key];
        return (
          <fieldset key={eje.key} className="flex flex-col gap-3">
            <legend className="text-lg font-bold">{eje.titulo}</legend>

            <div className="flex flex-col gap-2">
              {NIVELES.map((nivel) => (
                <label
                  key={nivel}
                  className={`flex flex-col gap-1 rounded-lg border px-3 py-3 ${
                    ejeState.nivel === nivel
                      ? "border-brand bg-brand-light"
                      : "border-black/15"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`score_${eje.key}`}
                      value={nivel}
                      checked={ejeState.nivel === nivel}
                      onChange={() => elegirNivel(eje.key, nivel, eje.feedback[nivel])}
                      required
                      className="h-4 w-4 accent-[var(--brand)]"
                    />
                    <span className="font-semibold">{NIVEL_LABEL[nivel]}</span>
                  </span>
                  <span className="text-sm text-foreground/70">{eje.descripciones[nivel]}</span>
                </label>
              ))}
            </div>

            <div>
              <label htmlFor={`feedback_${eje.key}`} className="block text-sm font-semibold">
                Feedback para el equipo
              </label>
              <textarea
                id={`feedback_${eje.key}`}
                name={`feedback_${eje.key}`}
                value={ejeState.feedback}
                onChange={(e) =>
                  setEjesState((prev) => ({
                    ...prev,
                    [eje.key]: { ...prev[eje.key], feedback: e.target.value },
                  }))
                }
                rows={4}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
              />
            </div>
          </fieldset>
        );
      })}

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state.guardado && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Evaluación guardada.
        </p>
      )}

      <BotonGuardar />
    </form>
  );
}
