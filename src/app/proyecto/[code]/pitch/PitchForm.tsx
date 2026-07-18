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
  ods: string;
  evidencia_indagacion: string;
  ficha_usuario: string;
  prototipo_tipo: string;
  prototipo_link: string;
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

      <details className="mt-2 rounded-xl border border-black/15 open:pb-4">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-brand-dark">
          ¿Están en el programa de 4 semanas? Completá esto también
        </summary>
        <div className="flex flex-col gap-4 px-4 pt-2">
          <Campo name="ods" label="ODS" defaultValue={valoresIniciales.ods} />
          <Campo
            name="evidencia_indagacion"
            label="Evidencia de indagación"
            defaultValue={valoresIniciales.evidencia_indagacion}
            textarea
          />
          <Campo
            name="ficha_usuario"
            label="Ficha de usuario"
            defaultValue={valoresIniciales.ficha_usuario}
            textarea
          />
          <div>
            <label htmlFor="prototipo_tipo" className="block text-sm font-semibold">
              Tipo de prototipo
            </label>
            <select
              id="prototipo_tipo"
              name="prototipo_tipo"
              defaultValue={valoresIniciales.prototipo_tipo}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
            >
              <option value="">Elegí una opción</option>
              <option value="papel">Papel</option>
              <option value="canva">Canva</option>
              <option value="figma">Figma</option>
              <option value="replit">Replit</option>
            </select>
          </div>
          <Campo
            name="prototipo_link"
            label="Link del prototipo"
            defaultValue={valoresIniciales.prototipo_link}
          />
        </div>
      </details>

      <StepFeedback error={state.error} guardado={state.guardado} />
      <PitchButtons />
    </form>
  );
}

function Campo({
  name,
  label,
  defaultValue,
  textarea,
}: {
  name: string;
  label: string;
  defaultValue: string;
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
          rows={3}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      ) : (
        <input
          id={name}
          name={name}
          defaultValue={defaultValue}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      )}
    </div>
  );
}
