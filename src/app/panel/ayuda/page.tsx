export default function AyudaPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-2xl font-bold">Ayuda para docentes</h1>
        <p className="mt-2 text-foreground/70">
          Qué es Chicas en IA, cómo se llega hasta acá y dónde encontrar más
          información del programa.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <section className="rounded-xl border border-black/10 p-5">
            <h2 className="text-lg font-bold text-brand-dark">El programa</h2>
            <p className="mt-2 text-sm text-foreground/80">
              Chicas en IA es un programa de XSTEM en colaboración con IBM
              SkillsBuild que acerca inteligencia artificial y habilidades
              digitales a estudiantes de 13 a 18 años. Los equipos trabajan en
              una idea de app con IA a lo largo del programa, y esta
              plataforma es donde la cargan para que su docente la revise y
              evalúe.
            </p>
            <a
              href="https://chicasenia.xstemla.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-brand-dark underline"
            >
              Más información del programa (chicasenia.xstemla.com) →
            </a>
          </section>

          <section className="rounded-xl border border-black/10 p-5">
            <h2 className="text-lg font-bold text-brand-dark">
              El proceso que hacen los equipos
            </h2>
            <p className="mt-2 text-sm text-foreground/80">
              Antes de cargar su proyecto en esta plataforma, cada equipo
              recorre un recorrido de diseño con sus docentes:
            </p>
            <ol className="mt-3 flex flex-col gap-3">
              <li className="text-sm">
                <span className="font-semibold">1. Diseño UX</span> — eligen
                una persona real para quien van a diseñar, e identifican qué
                problema tiene.
              </li>
              <li className="text-sm">
                <span className="font-semibold">2. Design Thinking</span> —
                piensan cómo una app podría ayudar a resolver ese problema, y
                definen la idea principal.
              </li>
              <li className="text-sm">
                <span className="font-semibold">3. Prototipado en papel</span>{" "}
                — dibujan a mano las pantallas principales de su app.
              </li>
              <li className="text-sm">
                <span className="font-semibold">4. Figma</span> — recrean esas
                pantallas en una herramienta digital y las conectan para
                simular la navegación.
              </li>
            </ol>
            <p className="mt-3 text-sm text-foreground/80">
              Con ese recorrido ya hecho, el equipo entra a esta plataforma
              para cargar su idea (problema, para quién es, qué haría la IA,
              el boceto y el pitch) y enviarla para evaluación.
            </p>
          </section>

          <section className="rounded-xl border border-black/10 p-5">
            <h2 className="text-lg font-bold text-brand-dark">
              Cómo evaluar en esta plataforma
            </h2>
            <ol className="mt-2 flex flex-col gap-2 text-sm text-foreground/80">
              <li>
                1. En <span className="font-semibold">Equipos</span> (panel
                principal), tocá <span className="font-semibold">Evaluar</span>{" "}
                en el equipo que quieras revisar.
              </li>
              <li>
                2. Elegí un nivel (Logrado / En proceso / Por desarrollar)
                para cada uno de los 4 ejes de la rúbrica.
              </li>
              <li>3. Ajustá el feedback sugerido si querés, y guardá.</li>
              <li>
                4. Desde <span className="font-semibold">Equipos</span> podés
                exportar todo a Excel.
              </li>
            </ol>
          </section>

          <section className="rounded-xl border border-black/10 bg-brand-light/40 p-5">
            <h2 className="text-lg font-bold text-brand-dark">¿Dudas?</h2>
            <p className="mt-2 text-sm text-foreground/80">
              Escribí a{" "}
              <a href="mailto:programas@xstemla.com" className="font-semibold underline">
                programas@xstemla.com
              </a>{" "}
              o por{" "}
              <a
                href="https://wa.me/5491139317273"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                WhatsApp
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
