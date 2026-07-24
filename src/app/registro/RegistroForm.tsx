"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registrarEquipo, type RegistrarEquipoState } from "./actions";

const initialState: RegistrarEquipoState = { success: false };

const hoy = new Date().toLocaleDateString("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function RegistroForm() {
  const [state, formAction, pending] = useActionState(registrarEquipo, initialState);
  const [copiado, setCopiado] = useState(false);

  if (state.success && state.accessCode) {
    const copiarCodigo = async () => {
      await navigator.clipboard.writeText(state.accessCode!);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    };

    return (
      <div className="mt-8 rounded-2xl border-2 border-brand/25 bg-brand-light p-6 text-center">
        <p className="text-sm font-medium text-brand-dark">Equipo {state.teamName} 🎉</p>
        <p className="mt-4 text-4xl font-mono font-bold tracking-[0.3em] text-brand-dark">
          {state.accessCode}
        </p>
        <button
          onClick={copiarCodigo}
          style={{ backgroundImage: "var(--brand-gradient)" }}
          className="mt-4 w-full rounded-2xl px-4 py-3 font-bold text-white shadow-lg shadow-brand/25 transition active:scale-[0.98]"
        >
          {copiado ? "¡Copiado!" : "Copiar"}
        </button>
        <p className="mt-4 text-sm text-foreground/80">
          Guarda este código, lo vas a necesitar para volver a editar tu
          proyecto.
        </p>
        <Link
          href={`/proyecto/${state.accessCode}`}
          className="mt-6 inline-block w-full rounded-xl border border-brand/40 px-4 py-3 font-semibold text-brand-dark"
        >
          Empezar a cargar la idea
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <div>
        <label htmlFor="team_name" className="block text-sm font-semibold">
          Nombre del equipo
        </label>
        <input
          id="team_name"
          name="team_name"
          required
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      </div>

      <div>
        <label htmlFor="institution" className="block text-sm font-semibold">
          Institución
        </label>
        <input
          id="institution"
          name="institution"
          required
          placeholder="Nombre de tu colegio o institución"
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="country" className="block text-sm font-semibold">
            País
          </label>
          <input
            id="country"
            name="country"
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-semibold">
            Ciudad
          </label>
          <input
            id="city"
            name="city"
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
          />
        </div>
      </div>

      <div>
        <label htmlFor="members" className="block text-sm font-semibold">
          Integrantes del grupo
        </label>
        <textarea
          id="members"
          name="members"
          required
          rows={3}
          placeholder="Un nombre por línea"
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        />
      </div>

      <div>
        <span className="block text-sm font-semibold">Fecha</span>
        <p className="mt-1 text-base text-foreground/70">{hoy}</p>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{ backgroundImage: "var(--brand-gradient)" }}
        className="mt-2 w-full rounded-2xl px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Registrando..." : "Registrar equipo"}
      </button>
    </form>
  );
}
