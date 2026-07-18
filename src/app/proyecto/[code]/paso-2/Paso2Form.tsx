"use client";

import { useActionState } from "react";
import { guardarPaso2, type GuardarState } from "../actions";
import StepButtons from "../StepButtons";
import StepFeedback from "../StepFeedback";

export default function Paso2Form({
  code,
  paraQuienInicial,
}: {
  code: string;
  paraQuienInicial: string;
}) {
  const action = guardarPaso2.bind(null, code);
  const [state, formAction] = useActionState<GuardarState, FormData>(action, {});

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <textarea
        name="para_quien"
        defaultValue={paraQuienInicial}
        rows={6}
        required
        placeholder="¿Quién usaría esta app?"
        className="w-full rounded-lg border border-black/15 px-3 py-3 text-base"
      />
      <StepFeedback error={state.error} guardado={state.guardado} />
      <StepButtons nextHref={`/proyecto/${code}/paso-3`} />
    </form>
  );
}
