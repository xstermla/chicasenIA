"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { subirBoceto, type SubirBocetoState } from "../actions";

function BotonSubir() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-brand px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
    >
      {pending ? "Subiendo..." : "Subir foto"}
    </button>
  );
}

export default function Paso4Form({
  code,
  bocetoUrlInicial,
}: {
  code: string;
  bocetoUrlInicial: string | null;
}) {
  const action = subirBoceto.bind(null, code);
  const [state, formAction] = useActionState<SubirBocetoState, FormData>(action, {});
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <div className="mt-6 flex flex-col gap-4">
      {(preview ?? bocetoUrlInicial) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview ?? bocetoUrlInicial ?? undefined}
          alt="Boceto de la pantalla principal"
          className="w-full rounded-xl border border-black/10 object-contain"
        />
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <input
          type="file"
          name="boceto"
          accept="image/*"
          capture="environment"
          required={!bocetoUrlInicial}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="w-full rounded-lg border border-black/15 px-3 py-3 text-base file:mr-3 file:rounded-lg file:border-0 file:bg-brand-light file:px-3 file:py-2 file:font-semibold file:text-brand-dark"
        />
        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}
        {state.ok && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Foto subida.
          </p>
        )}
        <BotonSubir />
      </form>

      <Link
        href={`/proyecto/${code}/paso-5`}
        className="w-full rounded-xl border border-brand/40 bg-brand-light px-6 py-4 text-center text-base font-semibold text-brand-dark transition hover:border-brand/60"
      >
        Siguiente
      </Link>
    </div>
  );
}
