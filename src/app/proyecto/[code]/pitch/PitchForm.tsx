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
  pitch_video_link: string;
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
        name="pitch_ia_adentro"
        label="La IA adentro..."
        defaultValue={valoresIniciales.pitch_ia_adentro}
      />
      <Campo
        name="pitch_se_llama_asi_porque"
        label="Se llama así porque..."
        defaultValue={valoresIniciales.pitch_se_llama_asi_porque}
      />
      <Campo
        name="pitch_problema_resuelve"
        label="Cuéntanos más sobre tu app"
        placeholder="Detalles, valor agregado, lo que quieras sumar..."
        defaultValue={valoresIniciales.pitch_problema_resuelve}
        textarea
      />

      <div>
        <label htmlFor="pitch_video_link" className="block text-sm font-semibold">
          Video del pitch (opcional)
        </label>
        <p className="mt-0.5 text-xs text-foreground/60">
          Sube el video a Google Drive (o YouTube) y pega aquí el link para
          que cualquiera lo pueda ver.
        </p>
        <input
          id="pitch_video_link"
          name="pitch_video_link"
          type="url"
          placeholder="https://drive.google.com/..."
          defaultValue={valoresIniciales.pitch_video_link}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      </div>

      <StepFeedback error={state.error} guardado={state.guardado} />
      <PitchButtons />
    </form>
  );
}

function Campo({
  name,
  label,
  defaultValue,
  placeholder,
  textarea,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={5}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      ) : (
        <input
          id={name}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      )}
    </div>
  );
}
