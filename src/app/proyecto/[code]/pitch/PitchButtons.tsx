"use client";

import { useFormStatus } from "react-dom";

export default function PitchButtons() {
  const { pending } = useFormStatus();

  return (
    <div className="mt-2 flex flex-col gap-3">
      <button
        type="submit"
        name="next"
        value=""
        disabled={pending}
        className="w-full rounded-2xl border-2 border-brand/30 bg-brand-light px-6 py-4 text-base font-semibold text-brand-dark transition hover:border-brand/50 disabled:opacity-60"
      >
        Guardar y seguir después
      </button>
      <button
        type="submit"
        name="next"
        value="ENVIAR"
        disabled={pending}
        style={{ backgroundImage: "var(--brand-gradient)" }}
        className="w-full rounded-2xl px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition active:scale-[0.98] disabled:opacity-60"
      >
        Enviar proyecto 🚀
      </button>
    </div>
  );
}
