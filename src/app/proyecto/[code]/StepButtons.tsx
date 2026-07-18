"use client";

import { useFormStatus } from "react-dom";

export default function StepButtons({ nextHref }: { nextHref?: string }) {
  const { pending } = useFormStatus();

  return (
    <div className="mt-2 flex flex-col gap-3">
      <button
        type="submit"
        name="next"
        value=""
        disabled={pending}
        className="w-full rounded-xl border border-brand/40 bg-brand-light px-6 py-4 text-base font-semibold text-brand-dark transition hover:border-brand/60 disabled:opacity-60"
      >
        Guardar y seguir después
      </button>
      {nextHref && (
        <button
          type="submit"
          name="next"
          value={nextHref}
          disabled={pending}
          className="w-full rounded-xl bg-brand px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
        >
          Siguiente
        </button>
      )}
    </div>
  );
}
