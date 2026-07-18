"use client";

import { useActionState } from "react";
import { reabrirProyecto, type ReabrirState } from "../../actions";

export default function ReabrirButton({ projectId }: { projectId: string }) {
  const action = reabrirProyecto.bind(null, projectId);
  const [state, formAction, pending] = useActionState<ReabrirState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 disabled:opacity-60"
      >
        {pending ? "Reabriendo..." : "Reabrir para editar"}
      </button>
      {state.error && <p className="text-xs text-red-700">{state.error}</p>}
    </form>
  );
}
