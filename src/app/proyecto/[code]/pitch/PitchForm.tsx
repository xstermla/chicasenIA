"use client";

import { useActionState } from "react";
import { guardarPitch, type GuardarState } from "../actions";
import StepFeedback from "../StepFeedback";
import PitchButtons from "./PitchButtons";

interface Valores {
  pitch_se_llama: string;
  pitch_la_creamos_para: string;
  pitch_problema_resuelve: string;
  pitch_ia_adentro: string;
  pitch_se_llama_asi_porque: string;
}

export default function PitchForm({
  code,
  valoresIniciales,
}: {
  code: string;
  valoresIniciales: Valores;
}) {
  const action = guardarPitch.bind(null, code);
  const [state, formAction] = useActionState<GuardarState, FormData>(action, {});

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <Campo
        name="pitch_se_llama"
        label="Nuestra app se llama..."
        defaultValue={valoresIniciales.pitch_se_llama}
      />
      <Campo
        name="pitch_la_creamos_para"
        label="La creamos para..."
        defaultValue={valoresIniciales.pitch_la_creamos_para}
      />
      <Campo
        name="pitch_problema_resuelve"
        label="El problema que resuelve es..."
        defaultValue={valoresIniciales.pitch_problema_resuelve}
      />
      <Campo
        name="pitch_ia_adentro"
        label="La IA adentro..."
        defaultValue={valoresIniciales.pitch_ia_adentro}
      />
      <Campo
        name="pitch_se_llama_asi_porque"
        label="Se llama así porque..."
        defaultValue={valoresIniciales.pitch_se_llama_asi_porque}
      />

      <StepFeedback error={state.error} guardado={state.guardado} />
      <PitchButtons />
    </form>
  );
}

function Campo({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
      />
    </div>
  );
}
