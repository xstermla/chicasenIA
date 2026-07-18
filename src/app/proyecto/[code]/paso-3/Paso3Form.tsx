"use client";

import { useActionState } from "react";
import { guardarPaso3, type GuardarState } from "../actions";
import StepButtons from "../StepButtons";
import StepFeedback from "../StepFeedback";

const OPCIONES = [
  "Responder preguntas",
  "Conectar personas",
  "Alertar o avisar",
  "Recomendar opciones",
  "Traducir o explicar",
  "Reconocer imágenes",
];

export default function Paso3Form({
  code,
  iaFuncionesIniciales,
  iaOtraInicial,
}: {
  code: string;
  iaFuncionesIniciales: string[];
  iaOtraInicial: string;
}) {
  const action = guardarPaso3.bind(null, code);
  const [state, formAction] = useActionState<GuardarState, FormData>(action, {});

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {OPCIONES.map((op) => (
          <label
            key={op}
            className="flex items-center gap-3 rounded-lg border border-black/15 px-3 py-3"
          >
            <input
              type="checkbox"
              name="ia_funciones"
              value={op}
              defaultChecked={iaFuncionesIniciales.includes(op)}
              className="h-5 w-5 accent-[var(--brand)]"
            />
            <span className="text-base">{op}</span>
          </label>
        ))}
      </div>

      <div>
        <label htmlFor="ia_otra" className="block text-sm font-semibold">
          Otra cosa:
        </label>
        <input
          id="ia_otra"
          name="ia_otra"
          defaultValue={iaOtraInicial}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      </div>

      <StepFeedback error={state.error} guardado={state.guardado} />
      <StepButtons nextHref={`/proyecto/${code}/paso-4`} />
    </form>
  );
}
