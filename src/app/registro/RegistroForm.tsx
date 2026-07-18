"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { listCohortes, registrarEquipo, type RegistrarEquipoState } from "./actions";
import type { CohortPublic, InstitutionPublic } from "@/lib/database.types";

const initialState: RegistrarEquipoState = { success: false };

const hoy = new Date().toLocaleDateString("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function RegistroForm({
  instituciones,
}: {
  instituciones: InstitutionPublic[];
}) {
  const [state, formAction, pending] = useActionState(registrarEquipo, initialState);
  const [institutionId, setInstitutionId] = useState("");
  const [cohortes, setCohortes] = useState<CohortPublic[]>([]);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!institutionId) return;
    let activo = true;
    listCohortes(institutionId).then((data) => {
      if (activo) setCohortes(data);
    });
    return () => {
      activo = false;
    };
  }, [institutionId]);

  function handleInstitutionChange(nuevoId: string) {
    setInstitutionId(nuevoId);
    setCohortes([]);
  }

  if (state.success && state.accessCode) {
    const copiarCodigo = async () => {
      await navigator.clipboard.writeText(state.accessCode!);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    };

    return (
      <div className="mt-8 rounded-2xl border border-brand/30 bg-brand-light p-6 text-center">
        <p className="text-sm font-medium text-brand-dark">Equipo {state.teamName}</p>
        <p className="mt-4 text-4xl font-mono font-bold tracking-[0.3em] text-brand-dark">
          {state.accessCode}
        </p>
        <button
          onClick={copiarCodigo}
          className="mt-4 w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          {copiado ? "¡Copiado!" : "Copiar"}
        </button>
        <p className="mt-4 text-sm text-foreground/80">
          Guardá este código, lo vas a necesitar para volver a editar tu
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
        <select
          id="institution"
          name="institution"
          required
          value={institutionId}
          onChange={(e) => handleInstitutionChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base"
        >
          <option value="">Elegí tu institución</option>
          {instituciones.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cohort_id" className="block text-sm font-semibold">
          Cohorte
        </label>
        <select
          id="cohort_id"
          name="cohort_id"
          required
          disabled={!institutionId}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-base disabled:opacity-50"
        >
          <option value="">
            {institutionId ? "Elegí la cohorte" : "Elegí primero la institución"}
          </option>
          {cohortes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
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
        className="mt-2 w-full rounded-xl bg-brand px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Registrando..." : "Registrar equipo"}
      </button>
    </form>
  );
}
