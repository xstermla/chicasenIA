"use client";

import { useActionState } from "react";
import { guardarPaso1, type GuardarState } from "../actions";
import StepButtons from "../StepButtons";
import StepFeedback from "../StepFeedback";

export default function Paso1Form({
  code,
  problemaInicial,
}: {
  code: string;
  problemaInicial: string;
}) {
  const action = guardarPaso1.bind(null, code);
  const [state, formAction] = useActionState<GuardarState, FormData>(action, {});

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <textarea
        name="problema"
        defaultValue={problemaInicial}
        rows={6}
        required
        placeholder="Contanos el problema que eligieron..."
        className="w-full rounded-lg border border-black/15 px-3 py-3 text-base"
      />
      <StepFeedback error={state.error} guardado={state.guardado} />
      <StepButtons nextHref={`/proyecto/${code}/paso-2`} />
    </form>
  );
}
