"use client";

import { useActionState } from "react";
import { guardarPaso5, type GuardarState } from "../actions";
import StepButtons from "../StepButtons";
import StepFeedback from "../StepFeedback";

export default function Paso5Form({
  code,
  nombreInicial,
  porQueInicial,
}: {
  code: string;
  nombreInicial: string;
  porQueInicial: string;
}) {
  const action = guardarPaso5.bind(null, code);
  const [state, formAction] = useActionState<GuardarState, FormData>(action, {});

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <div>
        <label htmlFor="nombre_app" className="block text-sm font-semibold">
          Nombre de la app
        </label>
        <input
          id="nombre_app"
          name="nombre_app"
          defaultValue={nombreInicial}
          required
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      </div>
      <div>
        <label htmlFor="nombre_por_que" className="block text-sm font-semibold">
          ¿Por qué ese nombre?
        </label>
        <textarea
          id="nombre_por_que"
          name="nombre_por_que"
          defaultValue={porQueInicial}
          rows={4}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      </div>
      <StepFeedback error={state.error} guardado={state.guardado} />
      <StepButtons nextHref={`/proyecto/${code}/pitch`} />
    </form>
  );
}
